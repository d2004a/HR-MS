const User = require('../models/User');
const Task = require('../models/Task');


const getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password').sort('-createdAt');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single employee detail
// @route   GET /api/admin/employees/:id
// @access  Private/Admin
const getEmployeeDetail = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const tasks = await Task.find({ employee: req.params.id })
            .populate('assignedBy', 'fullName')
            .sort('-createdAt');

        res.status(200).json({ employee, tasks });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Rate an employee (1-5)
// @route   PUT /api/admin/employees/:id/rate
// @access  Private/Admin
const rateEmployee = async (req, res) => {
    try {
        const { rating } = req.body;

        if (rating === undefined || rating < 0 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 0 and 5' });
        }

        const employee = await User.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.rating = rating;
        await employee.save();

        res.status(200).json({ message: 'Rating updated', rating: employee.rating });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeDetail,
    rateEmployee
};
