import { useState, useEffect } from "react";

export default function useMobile(maxWidth = 576) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= maxWidth);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= maxWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth]);

  return isMobile;
}