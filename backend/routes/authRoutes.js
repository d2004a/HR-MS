const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    changePassword,
    updateProfilePicture,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getMe);
router.put('/change-password', protect, changePassword);
router.put('/profile-picture', protect, updateProfilePicture);

module.exports = router;
