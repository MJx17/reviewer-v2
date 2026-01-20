// src/services/passwordService.js
import { apiRequest } from "../utils/api";

const PREFIX = "/password"; // prefix all password routes

// Request reset link
export const forgotPassword = async (email) => {
  return apiRequest(`${PREFIX}/forgot-password`, {
    method: "POST",
    body: { email },
  });
};

// Reset password using token
export const resetPassword = async (token, newPassword) => {
  return apiRequest(`${PREFIX}/reset-password/${token}`, {
    method: "POST",
    body: { newPassword },
  });
};
