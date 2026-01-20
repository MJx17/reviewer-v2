// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/AuthController');



router.post('/logout', userController.logoutUser);
router.post('/refresh', userController.refreshToken);
router.post('/create', userController.createUser);
router.post('/login', userController.loginUser);
// Protected route example
router.get("/profile", userController.getProfile);


module.exports = router;
