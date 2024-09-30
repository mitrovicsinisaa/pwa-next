import { Html, Head, Main, NextScript } from "next/document";
import PushSubscription from '../components/PushSubscription';


export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#fff" />
        </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        <PushSubscription />
      </body>
    </Html>
  );
}
