const Holiday = require('../models/Holiday');

// @desc    Get all holidays
// @route   GET /api/holidays
// @access  Private (All authenticated users)
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching holidays', error: error.message });
  }
};

// @desc    Create a holiday
// @route   POST /api/holidays
// @access  Private (Admin only)
exports.createHoliday = async (req, res) => {
  try {
    const { name, date, type } = req.body;
    
    if (!name || !date) {
      return res.status(400).json({ message: 'Name and date are required' });
    }

    const holiday = await Holiday.create({
      name,
      date,
      type: type || 'public'
    });

    res.status(201).json(holiday);
  } catch (error) {
    res.status(500).json({ message: 'Error creating holiday', error: error.message });
  }
};

// @desc    Delete a holiday
// @route   DELETE /api/holidays/:id
// @access  Private (Admin only)
exports.deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    
    if (!holiday) {
      return res.status(404).json({ message: 'Holiday not found' });
    }

    await holiday.deleteOne();
    res.status(200).json({ message: 'Holiday removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting holiday', error: error.message });
  }
};
