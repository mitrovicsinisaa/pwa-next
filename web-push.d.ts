declare module 'web-push' {
  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;

  export function sendNotification(
    subscription: PushSubscription | { endpoint: string; keys: { p256dh: string; auth: string } },
    payload: string | Buffer,
    options?: {
      TTL?: number;
      vapidDetails?: {
        subject: string;
        publicKey: string;
        privateKey: string;
      };
      gcmAPIKey?: string;
      JWT?: string;
      contentEncoding?: string;
    }
  ): Promise<{
    statusCode: number;
    body: string;
    headers: { [key: string]: string };
  }>;

  export function generateVAPIDKeys(): {
    publicKey: string;
    privateKey: string;
  };
}