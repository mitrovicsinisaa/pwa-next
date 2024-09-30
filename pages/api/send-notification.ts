import type { NextApiRequest, NextApiResponse } from 'next';
import webpush from 'web-push';
import { database } from '../../lib/firebase';
import { ref, get } from 'firebase/database';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (!publicVapidKey || !privateVapidKey) {
  console.error('VAPID keys are not set in environment variables');
}

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey || '',
  privateVapidKey || ''
);

// Define the shape of our PushSubscription
interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      if (!publicVapidKey || !privateVapidKey) {
        throw new Error('VAPID keys are not set');
      }

      // Fetch all subscriptions from Firebase
      const subscriptionsRef = ref(database, 'subscriptions');
      const snapshot = await get(subscriptionsRef);
      const subscriptions = snapshot.val();

      if (!subscriptions) {
        throw new Error('No saved subscriptions found');
      }

      const payload = JSON.stringify({
        title: 'Media Captured',
        body: 'Media has been captured!'
      });

      // Send notification to all subscriptions
    const notificationPromises = Object.values(subscriptions)
      .filter((subscription): subscription is PushSubscription =>
        typeof subscription === 'object' && subscription !== null &&
        'endpoint' in subscription && 'keys' in subscription &&
        typeof subscription.keys === 'object' && subscription.keys !== null &&
        'p256dh' in subscription.keys && 'auth' in subscription.keys
      )
      .map((subscription) =>
        webpush.sendNotification(subscription, payload)
      );

      await Promise.all(notificationPromises);

      console.log('Notifications sent successfully');
      res.status(200).json({ success: true, message: 'Notifications sent successfully' });
    } catch (err: unknown) {
      console.error('Error in send-notification API:', err);
      if (err instanceof Error) {
        res.status(500).json({ error: 'Error sending push notifications', details: err.message });
      } else {
        res.status(500).json({ error: 'Error sending push notifications', details: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}