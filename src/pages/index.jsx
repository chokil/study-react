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

const Home = () => {
  const counter = useCounter();
  const inputArray = useInputArray();
  const { setPageBackground } = useApp();
  useBgColor();

  useEffect(() => {
    setPageBackground('home');
  }, [setPageBackground]);

  return (
    <Layout title="Index page">
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
