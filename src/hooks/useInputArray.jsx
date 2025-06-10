import { useCallback, useState } from "react";
import { useApp } from "src/contexts/AppContext";

const DEFAULT_MAX_LENGTH = 20;

export const useInputArray = (maxLength = DEFAULT_MAX_LENGTH) => {
  const [text, setText] = useState("");
  const [array, setArray] = useState([]);
  const { addNotification } = useApp();

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    if (value.length > maxLength) {
      addNotification(`⚠️ ${maxLength}文字以内にしてください`);
      return;
    }
    setText(value);
  }, [maxLength, addNotification]);

  const handleAdd = useCallback(() => {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      addNotification("⚠️ テキストを入力してください");
      return;
    }
    
    setArray((prevArray) => {
      if (prevArray.includes(trimmedText)) {
        addNotification("⚠️ 同じ要素がすでに存在します");
        return prevArray;
      }
      setText("");
      addNotification(`✅ "${trimmedText}" を追加しました！`);
      return [...prevArray, trimmedText];
    });
  }, [text, addNotification]);

  const handleRemove = useCallback((itemToRemove) => {
    setArray((prevArray) => prevArray.filter(item => item !== itemToRemove));
    addNotification(`🗑️ "${itemToRemove}" を削除しました`);
  }, [addNotification]);

  return { text, array, handleAdd, handleChange, handleRemove };
};
