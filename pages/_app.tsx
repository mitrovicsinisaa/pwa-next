import "@/styles/globals.css";
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js').then(
            function (registration) {
              console.log('Service Worker registered with scope:', registration.scope);
            },
            function (error) {
              console.log('Service Worker registration failed:', error);
            }
        );
      }

      if ('Notification' in window) {
        Notification.requestPermission().then(function (result) {
          console.log('Notification permission:', result);
        });
      }
    }
  }, []);

  return <Component {...pageProps} />
}