import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { subscribeToPush, unsubscribeFromPush } from '../../services/subscribeService';
import { useAuth } from '../../context/authContext';
import Loading from '../ui/loading';
import '../../styles/feature.css';

const Hero = () => {
    const [subscribed, setSubscribed] = useState(false);
    const [subscriptionObj, setSubscriptionObj] = useState(null);
    const { user, loading } = useAuth();
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    // Check subscription on load
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        navigator.serviceWorker.ready.then(async (registration) => {
            const existing = await registration.pushManager.getSubscription();
            if (existing) {
                setSubscribed(true);
                setSubscriptionObj(existing);
            }
        });
    }, []);

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
    }

    const handleSubscribe = async () => {
        if (!user) return toast.warning("User not loaded yet.");
        if (!('serviceWorker' in navigator)) return toast.error("Push not supported.");

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return toast.error("Notification permission denied.");

        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            await subscribeToPush({ subscription, userId: user.id });
            setSubscribed(true);
            setSubscriptionObj(subscription);
            toast.success("Subscribed successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Subscription failed.");
        }
    };

    const handleUnsubscribe = async () => {
        if (!subscriptionObj) return;

        try {
            const registration = await navigator.serviceWorker.ready;
            await subscriptionObj.unsubscribe();
            await unsubscribeFromPush(subscriptionObj);
            setSubscribed(false);
            setSubscriptionObj(null);
            toast.info("You have unsubscribed from notifications.");
        } catch (err) {
            console.error(err);
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
                    Streamline your productivity with intuitive tools for to-do lists,
                    flashcards, and progress tracking. Ready to crush your goals today?
                </p>

                <div className="hero-actions">
                    {!subscribed ? (
                        <button className="subscribe-btn" onClick={handleSubscribe}>
                            Get Reminders 📢
                        </button>
                    ) : (
                        <button className="unsubscribe-btn" onClick={handleUnsubscribe}>
                            Subscribed ✅ (Click to Unsubscribe)
                        </button>
                    )}
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
