import { Layout } from "src/components/Layout";
import { Counter } from "src/components/Counter";
import { InputArray } from "src/components/InputArray";
import { Main } from "src/components/Main";
import { useCounter } from "src/hooks/useCounter";
import { useInputArray } from "src/hooks/useInputArray";
import { useBgColor } from "src/hooks/useBgColor";

const About = () => {
  const { doubleCount, ...counterProps } = useCounter();
  const inputArray = useInputArray();
  useBgColor();

  return (
    <Layout title="About page">
      <Counter {...counterProps} count={doubleCount} />
      <InputArray {...inputArray} />
      <Main page="about" />
    </Layout>
  );
};

export default About;
