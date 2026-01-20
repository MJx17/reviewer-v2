// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/AuthController');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/refresh', userController.refreshToken);
router.post('/create', userController.createUser);

// Protected route example
router.get('/profile', authenticateUser, (req, res) => {
  res.json({ message: 'User is authenticated!', user: req.user });
});

module.exports = router;
