import styles from "../styles/Home.module.css";
import Head from "next/head";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { useCounter } from "../hooks/useCounter";
import { useInputArray } from "../hooks/useInputArray";
import { useBgLightBlue } from "../hooks/useBgLightBlue";

export default function About() {
  const { count, isShow, handleClick, handleDisplay } = useCounter();
  const { text, array, handleAdd, handleChange } = useInputArray();
  useBgLightBlue();

  return (
    <div className={styles.container}>
      <Head>
        <title>About page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="btn-center">
        {isShow ? <h1>{count}</h1> : null}
        <button onClick={handleClick}>ボタン</button>
        <button onClick={handleDisplay}>{isShow ? "非表示" : "表示"}</button>
        <input
          style={{ display: "block", margin: "10px auto" }}
          type="text"
          value={text}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>追加</button>
        <ul>
          {array.map((item) => {
            return <li key={item}>{item}</li>;
          })}
        </ul>
      </div>
      <Main page="about" />

      <Footer />
    </div>
  );
}
