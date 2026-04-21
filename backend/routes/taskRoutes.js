const express = require('express');
const router = express.Router();
const { getMyTasks, updateTaskStatus } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Employee routes
router.get('/my', protect, getMyTasks);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
