// controller/userController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================
// Refresh Access Token
// =========================
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided.' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Check token against user in DB
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Set access token cookie

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,              // only secure in production
      sameSite: isProd ? 'None' : 'Lax', // use Lax for localhost
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Access token refreshed.' });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: 'Failed to refresh access token.' });
  }
};

// =========================
// Login User
// =========================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Create access token (for cookies)
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create refresh token (stored in DB)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,              // only secure in production
      sameSite: isProd ? 'None' : 'Lax', // use Lax for localhost
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful.' });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Error logging in.' });
  }
};

// =========================
// Logout User
// =========================
exports.logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: 'No refresh token found.' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('accessToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'None' : 'Lax', path: '/' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: isProd ? 'None' : 'Lax', path: '/' });

    return res.status(200).json({ message: 'Logout successful.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error logging out.' });
  }
};

// =========================
// Create User
// =========================
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error creating user.', message: err.message });
  }
};
