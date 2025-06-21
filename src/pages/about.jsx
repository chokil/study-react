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

const About = () => {
  const { doubleCount, ...counterProps } = useCounter();
  const inputArray = useInputArray();
  const { state } = useApp();
  useBgColor();

  useEffect(() => {
    if (state.theme === 'dark') {
      document.body.style.backgroundColor = '#2d3748';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'beige';
      document.body.style.color = 'black';
    }
  }, [state.theme]);

  return (
    <Layout title="About page">
      <CollaborativeCounter />
      <ResponsiveGrid>
        <div>
          <Counter {...counterProps} count={doubleCount} />
          <InputArray {...inputArray} />
        </div>
        <AnimatedList items={inputArray.array} onRemove={inputArray.handleRemove} />
      </ResponsiveGrid>
      <Main page="about" />
    </Layout>
  );
};

export default About;
