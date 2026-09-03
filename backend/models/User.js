const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['employee', 'hr'],
    default: 'employee'
  },
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  totalLeaves: {
    type: Number,
    default: 20
  },
  usedLeaves: {
    type: Number,
    default: 0
  },
  remainingLeaves: {
    type: Number,
    default: 20
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);