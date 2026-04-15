const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getMyAttendance
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, markAttendance)
    .get(protect, getMyAttendance);

module.exports = router;
