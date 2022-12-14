import styles from "../styles/Home.module.css";
import Head from "next/head";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { Main } from "../components/Main";

const About = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>About page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="btn-center">
        {props.isShow ? <h1>{props.doubleCount}</h1> : null}
        <button onClick={props.handleClick}>ボタン</button>
        <button onClick={props.handleDisplay}>
          {props.isShow ? "非表示" : "表示"}
        </button>
        <input
          style={{ display: "block", margin: "10px auto" }}
          type="text"
          value={props.text}
          onChange={props.handleChange}
        />
        <button onClick={props.handleAdd}>追加</button>
        <ul>
          {props.array.map((item) => {
            return <li key={item}>{item}</li>;
          })}
        </ul>
      </div>
      <Main page="about" />

      <Footer />
    </div>
  );
};

export default About;
