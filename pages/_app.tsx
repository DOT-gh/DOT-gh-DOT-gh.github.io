import type { AppProps } from "next/app";
import "../styles/tailwind.css";
import dynamic from "next/dynamic";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
