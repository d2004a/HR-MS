const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Attendance date is required']
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        required: [true, 'Attendance status is required']
    }
}, {
    timestamps: true
});

// Ensure an employee can only have one attendance record per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
