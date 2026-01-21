// services/pushService.js
import { apiRequest } from "../utils/api";

const PREFIX = "/push";

/**
 * Subscribe the current user/browser to push notifications.
 * @param {Object} subscription - The subscription object from the browser
 * @param {string} [userId] - Optional user ID
 */
export const subscribeToPush = async (subscription, userId) => {
  if (!subscription || !userId) throw new Error("Subscription and userId are required");

  const subPayload = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.getKey('p256dh')
        ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh'))))
        : '',
      auth: subscription.getKey('auth')
        ? btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
        : ''
    }
  };

  console.log("Sending subscription to backend:", { subscription: subPayload, userId });

  return apiRequest(`${PREFIX}/subscribe`, {
    method: 'POST',
    body: { subscription: subPayload, userId },
  });
};


/**
 * Unsubscribe the current user/browser from push notifications.
 * @param {string} endpoint - The subscription endpoint to remove
 */
export const unsubscribeFromPush = async (endpoint) => {
  return apiRequest(`${PREFIX}/unsubscribe`, {
    method: "POST",
    body: { endpoint }, // pass object directly
  });
};

/**
 * Send a custom push notification to a specific user.
 * @param {string} userId - The user ID to send the notification to
 * @param {string} title - The notification title
 * @param {string} body - The notification body
 */
export const sendCustomNotification = async (userId, title, body) => {
  return apiRequest(`${PREFIX}/send-notification`, {
    method: "POST",
    body: { userId, title, body }, // pass object directly
  });
};
