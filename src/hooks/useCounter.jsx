import { useCallback, useMemo, useState } from "react";

const MAX_COUNT = 10;

export const useCounter = (initialCount = 1, maxCount = MAX_COUNT) => {
  const [count, setCount] = useState(initialCount);
  const [isShow, setIsShow] = useState(true);
  
  const doubleCount = useMemo(() => {
    return count * 2;
  }, [count]);
  
  const handleClick = useCallback(() => {
    setCount((prevCount) => prevCount < maxCount ? prevCount + 1 : prevCount);
  }, [maxCount]);

  const handleDisplay = useCallback(() => {
    setIsShow((prevIsShow) => !prevIsShow);
  }, []);

  return { count, isShow, doubleCount, handleClick, handleDisplay };
};
