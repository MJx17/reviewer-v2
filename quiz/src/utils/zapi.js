// src/utils/api.js
const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const apiRequest = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // important for cookies
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (err) {
    console.error(`[API ERROR] ${endpoint}:`, err.message);
    throw err;
  }
};
