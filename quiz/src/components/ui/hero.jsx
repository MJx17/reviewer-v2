import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  subscribeToPush,
  unsubscribeFromPush,
  sendCustomNotification,
} from "../../services/subscribeService";
import { useAuth } from "../../context/authContext";
import Loading from "../ui/loading";
import "../../styles/feature.css";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const Hero = () => {
  const { user, loading } = useAuth();

  const [subscribed, setSubscribed] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);

  // Helper: convert VAPID key
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
  };

  // 1️⃣ Register SW + check REAL subscription state
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const init = async () => {
      try {
        await navigator.serviceWorker.register("/service-worker.js", {
          type: "module",
        });

        const reg = await navigator.serviceWorker.ready;
        setSwRegistration(reg);

        const existing = await reg.pushManager.getSubscription();
        setSubscribed(!!existing); // 🔑 browser = truth
      } catch (err) {
        console.error("Service Worker init failed:", err);
      }
    };

    init();
  }, []);

  // 2️⃣ Sync subscription to backend when user is ready
  useEffect(() => {
    if (!user || !swRegistration) return;

    const sync = async () => {
      const sub = await swRegistration.pushManager.getSubscription();
      if (!sub) return;

      try {
        await subscribeToPush(sub, user._id);
        setSubscribed(true);
        console.log("Subscription synced with backend");
      } catch (err) {
        console.error("Sync failed:", err);
        setSubscribed(false);
      }
    };

    sync();
  }, [user, swRegistration]);

  // 3️⃣ Subscribe
  const handleSubscribe = async () => {
    if (!user) return toast.warning("User not loaded yet.");
    if (!swRegistration) return toast.error("Service worker not ready.");

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted")
      return toast.error("Notification permission denied.");

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      await subscribeToPush(subscription, user._id);

      setSubscribed(true);
      toast.success("Subscribed successfully!");
    } catch (err) {
      console.error("Subscribe failed:", err);
      toast.error("Subscription failed.");
    }
  };

  // 4️⃣ Unsubscribe (SAFE + IDPOTENT)
  const handleUnsubscribe = async () => {
    if (!swRegistration) return;

    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (sub) {
        try {
          await sub.unsubscribe();
        } catch (err) {
          console.warn("Already unsubscribed in browser:", err);
        }

        await unsubscribeFromPush(sub);
      }

      setSubscribed(false);
      toast.info("You have unsubscribed from notifications.");
    } catch (err) {
      console.error("Unsubscribe flow failed:", err);
      toast.error("Failed to unsubscribe.");
    }
  };

  if (loading) return <Loading />;
  if (!user) return <p>User not authenticated.</p>;

  return (
    <header className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-greeting">Welcome back,</span>
          <span className="hero-username">{user.name} 👋</span>
        </h1>

        <p className="hero-description">
          Boost your productivity with handy features for to-do lists,
          flashcards, and notes. Stay motivated and make every day count!
        </p>

        <div className="hero-actions">
          <button
            className={`btn ${
              subscribed ? "unsubscribe-btn" : "subscribe-btn"
            }`}
            onClick={subscribed ? handleUnsubscribe : handleSubscribe}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="visual-container">
          <img src="/study.jpg" alt="Dashboard Overview" className="hero-image" />
        </div>
      </div>
    </header>
  );
};

export default Hero;
