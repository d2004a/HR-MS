const express = require('express');
const router = express.Router();
const { getAllEmployees } = require('../controllers/adminController');
const { getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { getAllAttendance } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/employees', getAllEmployees);

router.route('/leaves')
    .get(getAllLeaves);

router.route('/leaves/:id')
    .put(updateLeaveStatus);

router.get('/attendance', getAllAttendance);

module.exports = router;
