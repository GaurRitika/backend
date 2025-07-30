const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  maxAttendees: {
    type: Number,
    min: 1
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['confirmed', 'maybe', 'declined'],
      default: 'confirmed'
    }
  }],
  category: {
    type: String,
    enum: ['social', 'meeting', 'maintenance', 'security', 'celebration', 'workshop'],
    default: 'social'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    endAfter: {
      type: Number // number of occurrences
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
EventSchema.index({ startDate: 1, isActive: 1 });
EventSchema.index({ organizer: 1, startDate: -1 });
EventSchema.index({ category: 1, isPublic: 1 });
EventSchema.index({ 'attendees.user': 1 });

module.exports = mongoose.model('Event', EventSchema); 