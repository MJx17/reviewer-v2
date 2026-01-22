import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { subscribeToPush, unsubscribeFromPush, sendCustomNotification } from '../../services/subscribeService';
import { useAuth } from '../../context/authContext';
import Loading from '../ui/loading';
import '../../styles/feature.css';

const Hero = () => {
    const [subscribed, setSubscribed] = useState(false);
    const [subscriptionObj, setSubscriptionObj] = useState(null);
    const [swRegistration, setSwRegistration] = useState(null);
    const { user, loading } = useAuth();
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    // Helper to convert VAPID key
    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = atob(base64);
        return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
    }

    // 1️⃣ Register SW on mount
    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        const registerSW = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js', { type: 'module' });
                const readyReg = await navigator.serviceWorker.ready;

                setSwRegistration(readyReg);

                // Check existing subscription
                const existing = await readyReg.pushManager.getSubscription();
                if (existing) {
                    setSubscriptionObj(existing);
                }
            } catch (err) {
                console.error('Service Worker registration failed:', err);
            }
        };

        registerSW();
    }, []);

    // 2️⃣ Sync existing subscription to backend once user & subscription exist
    // Sync subscription once both exist
    useEffect(() => {
        if (!user || !subscriptionObj) return; // only run when both exist

        const syncSubscription = async () => {
            try {
                // send subscription to backend
                await subscribeToPush(subscriptionObj, user._id); // make sure it's _id, not id
                setSubscribed(true);
                console.log('Subscription synced with backend');
            } catch (err) {
                console.error('Failed to sync subscription:', err);
                setSubscribed(false);
            }
        };

        syncSubscription();
    }, [user, subscriptionObj]);


    // 3️⃣ Subscribe handler
    const handleSubscribe = async () => {
        if (!user) return toast.warning('User not loaded yet.');
        if (!swRegistration) return toast.error('Service worker not ready.');

        let permission = Notification.permission;
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }
        if (permission !== 'granted') return toast.error('Notification permission denied.');

        try {
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            // ✅ use _id
            await subscribeToPush(subscription, user._id);
            await sendCustomNotification('696641456237f43eb2d73bfa', 'Test Title', 'Hello from backend!');

            setSubscribed(true);
            setSubscriptionObj(subscription);
            toast.success('Subscribed successfully!');
        } catch (err) {
            console.error('Push subscription failed:', err);
            toast.error('Subscription failed. Make sure notifications are allowed.');
        }
    };


    // 4️⃣ Unsubscribe handler
    const handleUnsubscribe = async () => {
        if (!subscriptionObj) return;

        try {
            await subscriptionObj.unsubscribe();
            await unsubscribeFromPush(subscriptionObj);

            setSubscribed(false);
            setSubscriptionObj(null);
            toast.info('You have unsubscribed from notifications.');
        } catch (err) {
            console.error('Unsubscribe failed:', err);
            toast.error('Failed to unsubscribe.');
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
                    <button
                        className={`btn ${subscribed ? "unsubscribe-btn" : "subscribe-btn"}`}
                        onClick={subscribed ? handleUnsubscribe : handleSubscribe}
                    >
                        {subscribed ? "Subscribe" : "Unsubscribed"}
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
