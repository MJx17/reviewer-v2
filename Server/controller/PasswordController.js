// // controllers/passwordController.js
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");
// const bcrypt = require("bcryptjs");
// const User = require("../Models/user");

// // Utility response helper
// const sendResponse = (res, statusCode, data) => {
//   return res.status(statusCode).json(data);
// };

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS,
//   },
// });

// // Password validation
// const validatePassword = (password) => {
//   const minLength = 8;
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasNumbers = /\d/.test(password);
//   const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//   return (
//     password.length >= minLength &&
//     hasUpperCase &&
//     hasLowerCase &&
//     hasNumbers &&
//     hasSpecialChars
//   );
// };

// /**
//  * POST /auth/forgot-password
//  */
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     // ❗ Prevent email enumeration
//     if (!user) {
//       return sendResponse(res, 200, {
//         message: "If the email exists, a reset link has been sent.",
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");

//     user.resetToken = resetToken;
//     user.resetTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour
//     await user.save();

//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//     await transporter.sendMail({
//       to: user.email,
//       subject: "Password Reset Request",
//       html: `
//         <p>You requested a password reset.</p>
//         <p>
//           Click <a href="${resetUrl}">here</a> to reset your password.
//         </p>
//         <p>This link expires in 1 hour.</p>
//       `,
//     });

//     sendResponse(res, 200, {
//       message: "If the email exists, a reset link has been sent.",
//     });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     sendResponse(res, 500, {
//       message: "Error processing forgot password request.",
//     });
//   }
// };

// /**
//  * POST /auth/reset-password/:token
//  */
// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { newPassword } = req.body;

//   if (!validatePassword(newPassword)) {
//     return sendResponse(res, 400, {
//       message:
//         "Password must be at least 8 characters and include upper, lower, number, and special character.",
//     });
//   }

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiration: { $gt: Date.now() },
//     });

//     if (!user) {
//       return sendResponse(res, 400, {
//         message: "Invalid or expired token.",
//       });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetToken = undefined;
//     user.resetTokenExpiration = undefined;

//     await user.save();

//     sendResponse(res, 200, {
//       message: "Password reset successful.",
//     });
//   } catch (error) {
//     console.error("Reset password error:", error);
//     sendResponse(res, 500, {
//       message: "Error resetting password.",
//     });
//   }
// };
