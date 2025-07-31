const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['resident', 'admin'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  phone: { type: String },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: false }
    },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  isVoiceCallUser: { type: Boolean, default: false }
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 