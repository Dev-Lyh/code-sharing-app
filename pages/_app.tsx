// pages/_app.tsx
import '../src/styles/globals.css'; // Importe o CSS global
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
