import { Layout } from "src/components/Layout";
import { Counter } from "src/components/Counter";
import { InputArray } from "src/components/InputArray";
import { Main } from "src/components/Main";
import { useCounter } from "src/hooks/useCounter";
import { useInputArray } from "src/hooks/useInputArray";
import { useBgColor } from "src/hooks/useBgColor";

const Home = () => {
  const counter = useCounter();
  const inputArray = useInputArray();
  useBgColor();

  return (
    <Layout title="Index page">
      <Counter {...counter} />
      <InputArray {...inputArray} />
      <Main page="index" />
    </Layout>
  );
};

export default Home;
