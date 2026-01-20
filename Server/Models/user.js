const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Refresh token for persistent login
  refreshToken: {
    type: String,
    default: null,
  },
  // Optional: store token expiration if you want server-side invalidation
  refreshTokenExpiration: {
    type: Date,
    default: null,
  },
  // Password reset token
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiration: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); // adds createdAt / updatedAt automatically

const User = mongoose.models.user || mongoose.model('User', userSchema);
module.exports = User;
