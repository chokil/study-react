import Head from "next/head";
import PropTypes from "prop-types";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import classes from "./Layout.module.css";

export const Layout = ({ children, title = "Study React App" }) => {
  return (
    <div className={classes.container}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Reactの学習用アプリケーション - カウンター、リスト管理、テーマ切り替えなどの機能を実装" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="React, Next.js, 学習, チュートリアル, カウンター" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Reactの学習用アプリケーション" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Head>
      <Header />
      <main role="main" className={classes.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};