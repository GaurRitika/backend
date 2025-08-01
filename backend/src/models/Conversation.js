const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Ensure participants are unique and sorted
ConversationSchema.pre('save', function(next) {
  this.participants = [...new Set(this.participants)].sort();
  next();
});

// Index for efficient querying
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', ConversationSchema);