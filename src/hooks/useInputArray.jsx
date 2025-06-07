import { useCallback, useState } from "react";

const DEFAULT_MAX_LENGTH = 5;

export const useInputArray = (maxLength = DEFAULT_MAX_LENGTH) => {
  const [text, setText] = useState("");
  const [array, setArray] = useState([]);
  const [error, setError] = useState("");

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length > maxLength) {
      setError(`${maxLength}文字以内にしてください`);
      return;
    }
    setError("");
    setText(value);
  }, [maxLength]);

  const handleAdd = useCallback(() => {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      setError("テキストを入力してください");
      return;
    }
    
    if (array.includes(trimmedText)) {
      setError("同じ要素がすでに存在します。");
      return;
    }

    setArray((prevArray) => [...prevArray, trimmedText]);
    setText("");
    setError("");
  }, [text, array]);

  return { text, array, error, handleAdd, handleChange };
};
