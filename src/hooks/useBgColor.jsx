import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { useApp } from "src/contexts/AppContext";

const DEFAULT_PAGE_MAP = {
  "/": "home",
  "/about": "about",
};

export const useBgColor = (pageMap = DEFAULT_PAGE_MAP) => {
  const router = useRouter();
  const { setPageBackground } = useApp();

  const pageName = useMemo(() => {
    return pageMap[router.pathname] || null;
  }, [router.pathname, pageMap]);

  useEffect(() => {
    if (pageName && setPageBackground) {
      setPageBackground(pageName);
    }
    return () => {
      // Cleanup is handled by the context
    };
  }, [pageName, setPageBackground]);

  return pageName;
};
