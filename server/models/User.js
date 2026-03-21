const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['login', 'signup']
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
