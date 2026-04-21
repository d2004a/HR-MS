const express = require('express');
const router = express.Router();
const { getHolidays, createHoliday, deleteHoliday } = require('../controllers/holidayController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getHolidays)
  .post(protect, adminOnly, createHoliday);

router.route('/:id')
  .delete(protect, adminOnly, deleteHoliday);

module.exports = router;
