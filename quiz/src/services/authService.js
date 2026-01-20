// src/services/authService.js
import { apiRequest } from '../utils/api';

const PREFIX = '/auth'; // prefix all auth routes

export const loginService = async (email, password) => {
  return apiRequest(`${PREFIX}/login`, {
    method: 'POST',
    body: { email, password },
  });
};

// ✅ Fixed logout
export const logoutService = async () => {
  // use apiRequest directly with credentials included
  // or fetch with API_BASE
  const res = await fetch(`${import.meta.env.VITE_API_URL}${PREFIX}/logout`, {
    method: 'POST',
    credentials: 'include', // important to send cookies
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || 'Logout failed');
  }

  return await res.json();
};

export const refreshToken = async () => {
  return apiRequest(`${PREFIX}/refresh`, { method: 'POST' });
};


// Old Service storing token in cookies only
// Get the authenticated user's profile t
// export const getProfile = async () => {
//   return apiRequest(`${PREFIX}/profile`, { method: 'GET' });
// };

export const getProfile = async (accessToken = null) => {
  return apiRequest("/auth/profile", { method: "GET" }, accessToken);
};