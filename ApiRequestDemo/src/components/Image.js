import React, { useEffect, useState } from "react";

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.body.classList.contains("dark-mode");
    }
    return false;
  });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const body = document.body;
    const update = () => setIsDark(body.classList.contains("dark-mode"));
    update();

    const observer = new MutationObserver(update);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const Image = ({ className, src, srcDark, srcSet, srcSetDark, alt }) => {
  const isDark = useIsDarkMode();

  return (
    <img
      className={className}
      srcSet={isDark ? srcSetDark : srcSet}
      src={isDark ? srcDark : src}
      alt={alt}
    />
  );
};

export default Image;
