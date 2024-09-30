export {};

declare global {
  interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  var savedSubscription: PushSubscription | null;
}