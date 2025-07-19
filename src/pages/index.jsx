import { Layout } from "src/components/Layout";
import { Counter } from "src/components/Counter";
import { InputArray } from "src/components/InputArray";
import { AnimatedList } from "src/components/AnimatedList";
import { CollaborativeCounter } from "src/components/CollaborativeCounter";
import { Main } from "src/components/Main";
import { ResponsiveGrid } from "src/components/ResponsiveGrid";
import { useCounter } from "src/hooks/useCounter";
import { useInputArray } from "src/hooks/useInputArray";
import { useBgColor } from "src/hooks/useBgColor";
import { useApp } from "src/contexts/AppContext";
import { useEffect } from "react";
import Link from "next/link";
import classes from "../styles/Home.module.css";

const Home = () => {
  const counter = useCounter();
  const inputArray = useInputArray();
  const { state } = useApp();
  useBgColor();

  useEffect(() => {
    if (state.theme === 'dark') {
      document.body.style.backgroundColor = '#1a202c';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'lightblue';
      document.body.style.color = 'black';
    }
  }, [state.theme]);

  return (
    <Layout title="Index page">
      {/* Featured AI Companion Section */}
      <div className={classes.featuredSection}>
        <div className={classes.ariaCard}>
          <div className={classes.ariaContent}>
            <h2 className={classes.ariaTitle}>✨ AI コンパニオン Aria</h2>
            <p className={classes.ariaDescription}>
              最新技術で実現された日本のアニメ美少女AI。
              VTuberよりもスムーズなアニメーションと豊かな感情表現で、
              あなたとの会話を楽しくします。
            </p>
            <div className={classes.ariaFeatures}>
              <span className={classes.feature}>🎨 高精細アニメデザイン</span>
              <span className={classes.feature}>💫 魔法的パーティクル</span>
              <span className={classes.feature}>😊 9種類の感情表現</span>
              <span className={classes.feature}>🎭 リアルタイムアニメーション</span>
            </div>
            <Link href="/aria" className={classes.ariaButton}>
              ✨ AI コンパニオン Aria →
            </Link>
          </div>
          <div className={classes.ariaPreview}>
            <div className={classes.previewCanvas}>
              <div className={classes.animatedIcon}>💖</div>
            </div>
          </div>
        </div>
      </div>
      
      <CollaborativeCounter />
      <ResponsiveGrid>
        <div>
          <Counter {...counter} />
          <InputArray {...inputArray} />
        </div>
        <AnimatedList items={inputArray.array} onRemove={inputArray.handleRemove} />
      </ResponsiveGrid>
      <Main page="index" />
    </Layout>
  );
};

export default Home;
