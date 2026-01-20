const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }, // Store refresh token
  resetToken: { type: String, default: null }, // Nullable reset token
  resetTokenExpiration: { type: Date, default: null }, // Nullable expiration time
});

const User = mongoose.model('User', userSchema);
module.exports = User;
