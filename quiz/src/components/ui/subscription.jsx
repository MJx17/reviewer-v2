// components/PushSubscribeButton.jsx
import { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "../services/pushService";
import "../../styles/push.css";

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;

/**
 * Convert Base64 VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function PushSubscribeButton({ userId }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    // Register service worker
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(async (registration) => {
        console.log("Service Worker registered:", registration);

        // Check if already subscribed
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          setIsSubscribed(true);
          setSubscription(existingSub);
        }
      })
      .catch((err) => {
        console.error("SW registration failed:", err);
      });
  }, []);

  const handleSubscribe = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications not supported in this browser.");
      return;
    }

    // HTTPS check (required for production)
    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      alert("Push notifications require HTTPS. Subscription may fail.");
    }

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notifications blocked. Please allow notifications to subscribe.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push
      const newSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Send subscription to backend
      await subscribeToPush(newSub, userId);

      setSubscription(newSub);
      setIsSubscribed(true);
      alert("Subscribed to notifications!");
    } catch (err) {
      console.error("Push subscription failed:", err);
      alert("Failed to subscribe.");
    }
  };

  const handleUnsubscribe = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      await unsubscribeFromPush(subscription.endpoint);

      setSubscription(null);
      setIsSubscribed(false);
      alert("Unsubscribed from notifications.");
    } catch (err) {
      console.error("Unsubscribe failed:", err);
      alert("Failed to unsubscribe.");
    }
  };

  return (
    <button
      onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
      className={`push-btn ${isSubscribed ? "subscribed" : ""}`}
    >
      {isSubscribed ? "Disable Notifications" : "Enable Notifications"}
    </button>
  );
}
