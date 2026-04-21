const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Do not return password by default
    },
    role: {
        type: String,
        enum: ['employee', 'admin'],
        default: 'employee'
    },
    dateOfJoining: {
        type: Date,
        default: Date.now
    },
    leaveBalance: {
        type: Number,
        default: 1
    },
    lastLeaveAccrualDate: {
        type: Date,
        default: null
    },
    leaveYear: {
        type: Number,
        default: () => new Date().getFullYear()
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
