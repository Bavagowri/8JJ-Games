import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
}
