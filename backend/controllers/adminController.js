const User = require('../models/User');


const getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password').sort('-createdAt');
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllEmployees
};
