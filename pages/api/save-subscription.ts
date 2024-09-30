import type { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../lib/firebase';
import { ref, set } from 'firebase/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const subscription = req.body;

      // Generate a unique ID for the subscription
      const subscriptionId = Date.now().toString();

      // Save the subscription to Firebase
      await set(ref(database, `subscriptions/${subscriptionId}`), subscription);

      console.log('Subscription saved:', subscriptionId);

      res.status(201).json({ message: 'Subscription saved successfully', id: subscriptionId });
    } catch (error) {
      console.error('Error saving subscription:', error);
      res.status(500).json({ error: 'Error saving subscription' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}