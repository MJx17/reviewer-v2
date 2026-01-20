// components/PushSubscribeButton.jsx
import { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "../services/pushService";
import "../../styles/push.css"

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;

export default function PushSubscribeButton({ userId }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Check if service worker and push manager are available
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          setIsSubscribed(true);
          setSubscription(existingSub);
        }
      });
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;

      const newSub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });

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
