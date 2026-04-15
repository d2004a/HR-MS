const Leave = require('../models/Leave');
const User = require('../models/User');


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

        // Check if user has enough balance
        const user = await User.findById(req.user.id);
        if (user.leaveBalance < totalDays) {
            return res.status(400).json({ message: 'Insufficient leave balance' });
        }

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

// @desc    Get logged in user's leaves
// @route   GET /api/leaves
// @access  Private (Employee)
const getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ employee: req.user.id }).sort('-createdAt');
        res.status(200).json(leaves);
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
            if (user.leaveBalance < totalDays) {
                return res.status(400).json({ message: 'Insufficient leave balance' });
            }
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

        await leave.remove();

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

        // If previously pending and now approving, deduct balance
        if (leave.status === 'pending' && status === 'approved') {
            const user = await User.findById(leave.employee);
            if (user.leaveBalance < leave.totalDays) {
                return res.status(400).json({ message: 'Employee has insufficient leave balance' });
            }
            user.leaveBalance -= leave.totalDays;
            await user.save();
        } 
        // If previously approved and now rejecting/pending (edge case or undo), refund balance
        else if (leave.status === 'approved' && status !== 'approved') {
            const user = await User.findById(leave.employee);
            user.leaveBalance += leave.totalDays;
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
    updateLeave,
    deleteLeave,
    getAllLeaves,
    updateLeaveStatus
};
