import { useCallback, useState } from "react";

const DEFAULT_MAX_LENGTH = 5;

export const useInputArray = (maxLength = DEFAULT_MAX_LENGTH) => {
  const [text, setText] = useState("");
  const [array, setArray] = useState([]);

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length > maxLength) {
      alert(`${maxLength}文字以内にしてください`);
      return;
    }
    setText(value);
  }, [maxLength]);

  const handleAdd = useCallback(() => {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      alert("テキストを入力してください");
      return;
    }
    
    setArray((prevArray) => {
      if (prevArray.includes(trimmedText)) {
        alert("同じ要素がすでに存在します。");
        return prevArray;
      }
      setText("");
      return [...prevArray, trimmedText];
    });
  }, [text]);

  return { text, array, handleAdd, handleChange };
};
