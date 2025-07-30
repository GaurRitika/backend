const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'maintenance', 'security', 'event', 'emergency', 'policy'],
    default: 'general'
  },
  targetAudience: {
    type: [String],
    enum: ['all', 'residents', 'admins'],
    default: ['all']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    type: String
  }],
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
AnnouncementSchema.index({ isActive: 1, publishAt: -1 });
AnnouncementSchema.index({ category: 1, priority: 1 });
AnnouncementSchema.index({ targetAudience: 1 });
AnnouncementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Announcement', AnnouncementSchema); 