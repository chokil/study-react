import Head from "next/head";
import PropTypes from "prop-types";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import classes from "./Layout.module.css";

export const Layout = ({ children, title = "Study React App", description }) => {
  return (
    <div className={classes.container}>
      <Head>
        <title>{title}</title>
        <meta 
          name="description" 
          content={description || "Study React with Next.js - A learning project"} 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <a href="#main-content" className={classes.skipLink}>
        メインコンテンツへスキップ
      </a>
      <Header />
      <main id="main-content" className={classes.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};