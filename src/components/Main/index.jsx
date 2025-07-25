import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Headline } from "../Headline";
import { Links } from "../Links";
import { SuspenseDemo } from "../SuspenseDemo";
import classes from "./Main.module.css";

const ITEMS = [
  {
    href: "/aria",
    title: "✨ AI コンパニオン Aria →",
    description: "アニメ風美少女AIとチャット！最新技術でVTuberよりもスムーズなアニメーション体験",
  },
  {
    href: "https://nextjs.org/docs",
    title: "Documentation →",
    description: "Find in-depth information about Next.js features and API.",
  },
  {
    href: "https://nextjs.org/learn",
    title: "Learn →",
    description: "Learn about Next.js in an interactive course with quizzes!",
  },
  {
    href: "https://github.com/vercel/next.js/tree/canary/examples",
    title: "Examples →",
    description: "Discover and deploy boilerplate example Next.js projects.",
  },
  {
    href: "https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
    title: "Deploy →",
    description:
      "Instantly deploy your Next.js site to a public URL with Vercel.",
  },
];

export const Main = ({ page }) => {
  const [items, setItems] = useState(ITEMS);
  const handleReduce = useCallback(() => {
    setItems((prevItems) => {
      return prevItems.slice(0, prevItems.length - 1);
    });
  }, []);
  return (
    <main className={classes.main}>
      <Headline page={page} handleReduce={handleReduce}>
        <code className={classes.code}>{items.length}</code>
      </Headline>
      <SuspenseDemo />
      <Links items={items} />
    </main>
  );
};

Main.propTypes = {
  page: PropTypes.string.isRequired,
};
