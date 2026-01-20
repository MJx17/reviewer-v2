// services/pushService.js
import { apiRequest } from "../utils/api";

const PREFIX = "/push";

/**
 * Subscribe the current user/browser to push notifications.
 * @param {Object} subscription - The subscription object from the browser
 * @param {string} [userId] - Optional user ID
 */
export const subscribeToPush = async (subscription, userId = null) => {
  return apiRequest(`${PREFIX}/subscribe`, {
    method: "POST",
    body: JSON.stringify({ subscription, userId }),
  });
};

/**
 * Unsubscribe the current user/browser from push notifications.
 * @param {string} endpoint - The subscription endpoint to remove
 */
export const unsubscribeFromPush = async (endpoint) => {
  return apiRequest(`${PREFIX}/unsubscribe`, {
    method: "POST",
    body: JSON.stringify({ endpoint }),
  });
};


