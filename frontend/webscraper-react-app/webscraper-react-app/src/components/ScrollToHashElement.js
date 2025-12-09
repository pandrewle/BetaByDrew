import { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const ScrollToHashElement = () => {
  const location = useLocation();

  const hashElement = useMemo(() => {
    const hash = location.hash;
    const removeHashCharacter = (str) => str.slice(1);

    if (hash) {
      return document.getElementById(removeHashCharacter(hash));
    }
    return null;
  }, [location]);
  useEffect(() => {
    if (hashElement) {
      // Apply blur effect to the body or a wrapper element
      console.log("hashElement", hashElement);
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: hashElement, autoKill: true },
        ease: "power4.out",
      });
    } else if (location.pathname === "/") {
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: 0, autoKill: true },
        ease: "power4.out",
      });
    }
  }, [hashElement, location]);

  return null;
};

export default ScrollToHashElement;
