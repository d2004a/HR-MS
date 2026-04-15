const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getMyLeaves,
    updateLeave,
    deleteLeave
} = require('../controllers/leaveController');
const { protect } = require('../middleware/auth');

router.route('/')
    .post(protect, applyLeave)
    .get(protect, getMyLeaves);

router.route('/:id')
    .put(protect, updateLeave)
    .delete(protect, deleteLeave);

module.exports = router;
