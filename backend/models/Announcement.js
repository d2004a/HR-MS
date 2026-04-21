const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Announcement message is required'],
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'important'],
    default: 'info',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
