const Task = require('../models/Task');

// @desc    Admin assigns a task to an employee
// @route   POST /api/tasks/:employeeId
// @access  Private/Admin
const assignTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const task = await Task.create({
            employee: req.params.employeeId,
            title,
            description,
            priority: priority || 'medium',
            dueDate,
            assignedBy: req.user.id
        });

        const populated = await Task.findById(task._id)
            .populate('employee', 'fullName email')
            .populate('assignedBy', 'fullName');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get tasks for a specific employee (admin use)
// @route   GET /api/admin/employees/:id/tasks
// @access  Private/Admin
const getEmployeeTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ employee: req.params.id })
            .populate('assignedBy', 'fullName')
            .sort('-createdAt');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Employee views own tasks
// @route   GET /api/tasks/my
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ employee: req.user.id })
            .populate('assignedBy', 'fullName')
            .sort('-createdAt');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Employee updates task status
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.employee.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        if (!['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        task.status = status;
        await task.save();

        const populated = await Task.findById(task._id)
            .populate('employee', 'fullName email')
            .populate('assignedBy', 'fullName');

        res.status(200).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Admin views all tasks
// @route   GET /api/admin/tasks
// @access  Private/Admin
const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({})
            .populate('employee', 'fullName email')
            .populate('assignedBy', 'fullName')
            .sort('-createdAt');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    assignTask,
    getEmployeeTasks,
    getMyTasks,
    updateTaskStatus,
    getAllTasks
};
