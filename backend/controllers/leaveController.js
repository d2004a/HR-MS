const Leave = require('../models/Leave');
const User = require('../models/User');
const { accrueMonthlyLeave, getLeavesThisMonth } = require('../utils/leaveAccrual');


const applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        if (!leaveType || !startDate || !endDate) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Calculate total days (inclusive)
        const timeDiff = Math.abs(end.getTime() - start.getTime());
        const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

        // Run accrual check first (handles year-end lapse + monthly accrual)
        await accrueMonthlyLeave(req.user.id);

        // Check if user has enough balance
        const user = await User.findById(req.user.id);
        if (user.leaveBalance < totalDays) {
            return res.status(400).json({ 
                message: `Insufficient leave balance. You have ${user.leaveBalance} day(s) available.` 
            });
        }

        // Check if user already has taken or applied for leaves this month
        // We allow 2 leaves per month now to accommodate 20/year
        const leavesThisMonthCount = await getLeavesThisMonth(req.user.id);
        
        // Also check pending leaves for this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        
        const pendingLeavesThisMonth = await Leave.find({
            employee: req.user.id,
            status: 'pending',
            startDate: { $lte: endOfMonth },
            endDate: { $gte: startOfMonth }
        });

        const totalUsedOrPendingThisMonth = leavesThisMonthCount + pendingLeavesThisMonth.length;
        if (totalUsedOrPendingThisMonth >= 2) {
            return res.status(400).json({ 
                message: 'Monthly leave limit reached (2 leaves per month). Unused leaves will roll over.' 
            });
        }

        // Deduct balance immediately
        user.leaveBalance = Math.round((user.leaveBalance - totalDays) * 100) / 100;
        await user.save();

        const leave = await Leave.create({
            employee: req.user.id,
            leaveType,
            startDate: start,
            endDate: end,
            totalDays,
            reason
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user.id }).sort('-createdAt');
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get leave stats for current month
// @route   GET /api/leaves/stats
// @access  Private (Employee)
const getLeaveStats = async (req, res) => {
    try {
        // Run accrual check
        await accrueMonthlyLeave(req.user.id);
        const user = await User.findById(req.user.id);
        
        const leavesThisMonth = await getLeavesThisMonth(req.user.id);
        
        // Count total approved leaves this year
        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const yearEnd = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
        const approvedThisYear = await Leave.countDocuments({
            employee: req.user.id,
            status: 'approved',
            startDate: { $gte: yearStart, $lte: yearEnd }
        });

        res.status(200).json({
            leaveBalance: user.leaveBalance,
            leavesUsedThisMonth: leavesThisMonth,
            maxPerMonth: 2,
            leavesUsedThisYear: approvedThisYear,
            leaveYear: user.leaveYear,
            canApplyThisMonth: leavesThisMonth < 2
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update pending leave
// @route   PUT /api/leaves/:id
// @access  Private (Employee)
const updateLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        // Check if leave belongs to user
        if (leave.employee.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Can only edit pending leaves
        if (leave.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot edit an processed leave request' });
        }

        const { leaveType, startDate, endDate, reason } = req.body;
        
        // Recalculate days if dates changed
        let totalDays = leave.totalDays;
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start > end) {
                return res.status(400).json({ message: 'End date must be after start date' });
            }
            const timeDiff = Math.abs(end.getTime() - start.getTime());
            totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            
            // Recheck balance
            const user = await User.findById(req.user.id);
            const daysDiff = totalDays - leave.totalDays;
            if (user.leaveBalance < daysDiff) {
                return res.status(400).json({ message: 'Insufficient leave balance' });
            }
            
            // Adjust balance
            user.leaveBalance = Math.round((user.leaveBalance - daysDiff) * 100) / 100;
            await user.save();
        }

        const updatedLeave = await Leave.findByIdAndUpdate(
            req.params.id,
            { leaveType, startDate, endDate, reason, totalDays },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Cancel pending leave
// @route   DELETE /api/leaves/:id
// @access  Private (Employee)
const deleteLeave = async (req, res) => {
    try {
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        // Check if leave belongs to user
        if (leave.employee.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Can only cancel pending leaves
        if (leave.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot cancel an processed leave request' });
        }

        // Refund balance
        const user = await User.findById(req.user.id);
        if (user) {
            user.leaveBalance = Math.round((user.leaveBalance + leave.totalDays) * 100) / 100;
            await user.save();
        }

        await Leave.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Leave request cancelled' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all leaves (Admin)
// @route   GET /api/admin/leaves
// @access  Private/Admin
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({}).populate('employee', 'fullName email').sort('-createdAt');
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Approve or Reject leave (Admin)
// @route   PUT /api/admin/leaves/:id
// @access  Private/Admin
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave not found' });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // If previously NOT rejected and now rejecting, refund balance
        if (leave.status !== 'rejected' && status === 'rejected') {
            const user = await User.findById(leave.employee);
            if (user) {
                user.leaveBalance = Math.round((user.leaveBalance + leave.totalDays) * 100) / 100;
                await user.save();
            }
        } 
        // If previously rejected and now approving/pending, deduct balance again
        else if (leave.status === 'rejected' && status !== 'rejected') {
            const user = await User.findById(leave.employee);
            if (user.leaveBalance < leave.totalDays) {
                return res.status(400).json({ message: 'Employee has insufficient leave balance' });
            }
            user.leaveBalance = Math.round((user.leaveBalance - leave.totalDays) * 100) / 100;
            await user.save();
        }

        leave.status = status;
        const updatedLeave = await leave.save();

        res.status(200).json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    applyLeave,
    getMyLeaves,
    getLeaveStats,
    updateLeave,
    deleteLeave,
    getAllLeaves,
    updateLeaveStatus
};
