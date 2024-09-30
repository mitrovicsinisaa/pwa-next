import React, { useEffect, useState } from 'react';

const PushSubscription: React.FC = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        checkSubscription();
    }, []);

    const checkSubscription = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        }
    };

    const subscribe = async () => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                });

                await fetch('/api/save-subscription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscription),
                });

                setIsSubscribed(true);
                console.log('Push notification subscription successful');
            } catch (error) {
                console.error('Error subscribing to push notifications:', error);
            }
        }
    };

    return (
        <div>
            {!isSubscribed ? (
                <button onClick={subscribe} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Subscribe to Push Notifications
                </button>
            ) : (
                <p>You are subscribed to push notifications</p>
            )}
        </div>
    );
};

export default PushSubscription;