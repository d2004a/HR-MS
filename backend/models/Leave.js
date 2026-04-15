const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leaveType: {
        type: String,
        enum: ['casual', 'sick', 'paid'],
        required: [true, 'Leave type is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    totalDays: {
        type: Number,
        required: true,
        min: 1
    },
    reason: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
