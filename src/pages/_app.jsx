import "../styles/globals.css";
import { useCounter } from "../hooks/useCounter";
import { useInputArray } from "../hooks/useInputArray";
import { useBgColor } from "../hooks/useBgColor";

function MyApp({ Component, pageProps }) {
  const counter = useCounter();
  const inputArray = useInputArray();
  useBgColor();
  return <Component {...pageProps} {...counter} {...inputArray} />;
}

export default MyApp;
