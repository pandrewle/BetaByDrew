import { useRef, useEffect, useState, useContext } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Hero from "../components/Hero";
import { SearchSubmitContext, AnimationContext } from "./AppContext";
gsap.registerPlugin(useGSAP);

function Parallax() {
  const [background, setBackground] = useState(20);
  const { animationComplete, setAnimationComplete } =
    useContext(AnimationContext);
  const { searchSubmitted, setSearchSubmitted } =
    useContext(SearchSubmitContext);

  const parallaxRef = useRef(null);
  const mountain3 = useRef(null);
  const mountain2 = useRef(null);
  const mountain1 = useRef(null);
  const cloudsBottom = useRef(null);
  const cloudsLeft = useRef(null);
  const cloudsRight = useRef(null);
  const stars = useRef(null);
  const sun = useRef(null);
  const copy = useRef(null);

  useGSAP((context, contextSafe) => {
    // const onLoad = contextSafe(() => {
    const tl = gsap.timeline({
      defaults: { duration: 3 },
    });
    if (!animationComplete) {
      tl.to(mountain3.current, { y: "-=80" }, 0)
        .to(mountain2.current, { y: "-=30" }, 0)
        .to(mountain1.current, { y: "+=50" }, 0)
        .to(stars.current, { top: 0 }, 0.5)
        .to(cloudsBottom.current, { opacity: 0, duration: 0.5 }, 0)
        .to(cloudsLeft.current, { x: "-20%", opacity: 0 }, 0)
        .to(cloudsRight.current, { x: "20%", opacity: 0 }, 0)
        .to(sun.current, { y: "+=210" }, 0)
        .to(copy.current, { opacity: 1 }, 1.5);
    } else {
      tl.set(mountain3.current, { y: "-=80" }, 0)
        .set(mountain2.current, { y: "-=30" }, 0)
        .set(mountain1.current, { y: "+=50" }, 0)
        .set(stars.current, { top: 0 }, 0)
        .set(cloudsBottom.current, { opacity: 0, duration: 0 }, 0)
        .set(cloudsLeft.current, { x: "-20%", opacity: 0 }, 0)
        .set(cloudsRight.current, { x: "20%", opacity: 0 }, 0)
        .set(sun.current, { y: "+=210" }, 0)
        .set(copy.current, { opacity: 1 }, 0);
      setAnimationComplete(false);
    }
  }, []);

  // useGSAP(
  //   (context, contextSafe) => {
  //     if (searchSubmitted) {
  //       const t2 = gsap.timeline({
  //         defaults: { duration: 1 },
  //         onComplete: () => {
  //           setAnimationComplete(true); // Notify that the animation is complete
  //         },
  //       });

  //       t2.set(mountain3.current, { zIndex: 10 }, 0)
  //         .set(mountain2.current, { zIndex: 9 }, 0)
  //         .set(mountain1.current, { zIndex: 8 }, 0)
  //         .to(
  //           mountain3.current,
  //           { y: "-=460", z: "1000", scaleY: 40, scaleX: 1 },
  //           0.5
  //         )
  //         .to(
  //           mountain2.current,
  //           {
  //             y: "-=400",
  //             z: "1000",
  //             scaleY: 40,
  //             scaleX: 1,
  //           },
  //           0.5
  //         )
  //         .to(
  //           mountain1.current,
  //           {
  //             y: "-=540",
  //             z: "1000",
  //             scaleY: 40,
  //             scaleX: 1,
  //           },
  //           0.5
  //         )
  //         .to(nav.current, { opacity: 0, duration: 0.5 }, 0);
  //     }
  //   },
  //   [searchSubmitted]
  // );

  return (
    <>
      <div className="parallax-outer" id="parallax">
        <div
          ref={parallaxRef}
          style={{
            background: `linear-gradient(#0F2B9C, #673D7D ${background}%, #A74A67, #EDFC54 )`,
          }}
          className="parallax"
        >
          <img
            ref={mountain3}
            className="mountain-3"
            src="/assets/mountain-3.svg"
          />
          <img
            ref={mountain2}
            className="mountain-2"
            src="/assets/mountain-2.svg"
          />
          <img
            ref={mountain1}
            className="mountain-1"
            src="/assets/mountain-1.svg"
          />
          <img ref={sun} className="sun" src="/assets/sun.svg" />
          <img
            ref={cloudsBottom}
            className="clouds-bottom"
            src="/assets/cloud-bottom.svg"
          />
          <img
            ref={cloudsLeft}
            className="clouds-left"
            src="/assets/clouds-left.svg"
          />
          <img
            ref={cloudsRight}
            className="clouds-right"
            src="/assets/clouds-right.svg"
          />
          <img ref={stars} className="stars" src="/assets/stars.svg" />
          <Hero
            ref={copy}
            className="copy"
            setSearchSubmitted={setSearchSubmitted}
          />
        </div>
      </div>
    </>
  );
}

export default Parallax;
