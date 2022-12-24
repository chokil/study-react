import "../styles/globals.css";
import { useCounter } from "../hooks/useCounter";
import { useInputArray } from "../hooks/useInputArray";
import { useBgLightBlue } from "../hooks/useBgLightBlue";

function MyApp({ Component, pageProps }) {
  const counter = useCounter();
  const inputArray = useInputArray();
  useBgLightBlue();
  return <Component {...pageProps} {...counter} {...inputArray} />;
}

export default MyApp;
