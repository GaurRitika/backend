const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['general', 'maintenance', 'security', 'noise', 'utilities', 'cleaning', 'parking'],
    default: 'general'
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  resolvedAt: {
    type: Date
  },
  source: {
    type: String,
    enum: ['web', 'voice_call'],
    default: 'web'
  },
  voiceCallData: {
    callId: String,
    agentId: String,
    phoneNumber: String,
    callDuration: Number,
    conversationSummary: String,
    extractedVariables: mongoose.Schema.Types.Mixed,
    issueType: String,
    location: String
  }
}, {
  timestamps: true
});

// Index for better query performance
IssueSchema.index({ status: 1, createdAt: -1 });
IssueSchema.index({ resident: 1, createdAt: -1 });
IssueSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Issue', IssueSchema); 