const Attendance = require('../models/Attendance');

// @desc    Mark daily attendance
// @route   POST /api/attendance
// @access  Private (Employee)
const markAttendance = async (req, res) => {
    try {
        const { date, status } = req.body;

        if (!date || !status) {
            return res.status(400).json({ message: 'Please provide date and status' });
        }

        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0); // Normalize to midnight for comparison

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (attendanceDate > today) {
            return res.status(400).json({ message: 'Cannot mark attendance for future dates' });
        }

        if (!['present', 'absent'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Check if already marked for this date
        const existingAttendance = await Attendance.findOne({
            employee: req.user.id,
            date: {
                $gte: attendanceDate,
                $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }

        const attendance = await Attendance.create({
            employee: req.user.id,
            date: attendanceDate,
            status
        });

        res.status(201).json(attendance);
    } catch (error) {
        // Handle duplicate key error manually just in case
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Attendance already marked for this date' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get own attendance history
// @route   GET /api/attendance
// @access  Private (Employee)
const getMyAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ employee: req.user.id }).sort('-date');
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all attendance (Admin)
// @route   GET /api/admin/attendance
// @access  Private/Admin
const getAllAttendance = async (req, res) => {
    try {
        // Optional filtering by date or employee id
        const { date, employeeId } = req.query;
        let query = {};

        if (employeeId) {
            query.employee = employeeId;
        }

        if (date) {
            const queryDate = new Date(date);
            queryDate.setHours(0, 0, 0, 0);
            query.date = {
                $gte: queryDate,
                $lt: new Date(queryDate.getTime() + 24 * 60 * 60 * 1000)
            };
        }

        const attendance = await Attendance.find(query)
            .populate('employee', 'fullName email')
            .sort('-date');
        
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    markAttendance,
    getMyAttendance,
    getAllAttendance
};
