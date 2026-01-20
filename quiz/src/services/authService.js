// src/services/authService.js
import { apiRequest } from '../utils/api';

const PREFIX = '/auth'; // prefix all auth routes

export const login = async (email, password) => {
  return apiRequest(`${PREFIX}/login`, {
    method: 'POST',
    body: { email, password },
  });
};

// ✅ Fixed logout
export const logout = async () => {
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

// Get the authenticated user's profile
export const getProfile = async () => {
  return apiRequest(`${PREFIX}/profile`, { method: 'GET' });
};
