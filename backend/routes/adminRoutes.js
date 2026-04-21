const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeDetail, rateEmployee } = require('../controllers/adminController');
const { getAllLeaves, updateLeaveStatus } = require('../controllers/leaveController');
const { getAllAttendance } = require('../controllers/attendanceController');
const { assignTask, getEmployeeTasks, getAllTasks } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

// Employee management
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeDetail);
router.put('/employees/:id/rate', rateEmployee);
router.get('/employees/:id/tasks', getEmployeeTasks);

// Task management
router.post('/tasks/:employeeId', assignTask);
router.get('/tasks', getAllTasks);

// Leave management
router.route('/leaves')
    .get(getAllLeaves);

router.route('/leaves/:id')
    .put(updateLeaveStatus);

// Attendance
router.get('/attendance', getAllAttendance);

module.exports = router;
