import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

const DEFAULT_COLOR_MAP = {
  "/": "lightblue",
  "/about": "beige",
};

export const useBgColor = (colorMap = DEFAULT_COLOR_MAP) => {
  const router = useRouter();

  const bgColor = useMemo(() => {
    return colorMap[router.pathname] || "";
  }, [router.pathname, colorMap]);

  useEffect(() => {
    document.body.style.backgroundColor = bgColor;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [bgColor]);

  return bgColor;
};
