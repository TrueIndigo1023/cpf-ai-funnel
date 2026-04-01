import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function MetaPixelPageView() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [location.pathname]);

  return null;
}
