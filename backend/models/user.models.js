const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  department: {
    type: String,
    default: ''
  },
  profilephoto: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
