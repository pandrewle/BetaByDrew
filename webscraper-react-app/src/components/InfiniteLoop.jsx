import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

export const useInfiniteLoop = (
  results,
  animatedItems,
  spacing,
  containerRef
) => {
  const iteration = useRef(0);
  const snap = gsap.utils.snap(spacing);
  const isInitialized = useRef(false);
  const result = useRef(results);
  console.log("starting");
  console.log(results);

  useGSAP(
    (context, contextSafe) => {
      const buildInfiniteLoop = contextSafe(() => {
        const totalScrollLength = animatedItems.length * 1000;
        const seamlessLoop = buildSeamlessLoop(animatedItems, spacing);
        const scrub = gsap.to(seamlessLoop, {
          totalTime: 0,
          duration: 0.5,
          ease: "power3",
          paused: true,
        });

        gsap.matchMedia().add(
          {
            // Define the breakpoints and corresponding settings
            isMobile: "(max-width: 767px)",
            isDesktop: "(min-width: 1024px)",
          },
          (context) => {
            let trigger;
            if (context.conditions.isMobile) {
              // Mobile-specific ScrollTrigger configuration
              trigger = ScrollTrigger.create({
                start: "bottom center",
                end: `+=${totalScrollLength} top`,
                pin: containerRef, // Use mobile-specific pin element
                scrub: 1,
                markers: true,
                onUpdate(self) {
                  const progress = self.progress;
                  if (progress > 0.8 && self.direction > 0 && !self.wrapping) {
                    wrapForward(self);
                  } else {
                    scrub.vars.totalTime = snap(
                      (iteration.current + progress) * seamlessLoop.duration()
                    );
                    scrub.invalidate().restart();
                    self.wrapping = false;
                  }
                },
              });
            } else if (context.conditions.isDesktop) {
              // Desktop-specific ScrollTrigger configuration
              trigger = ScrollTrigger.create({
                start: "bottom bottom",
                end: `+=${totalScrollLength}`,
                pin: containerRef, // Use desktop-specific pin element
                scrub: 1,
                markers: true,
                onUpdate(self) {
                  const progress = self.progress;
                  if (progress === 1 && self.direction > 0 && !self.wrapping) {
                    wrapForward(self);
                  } else {
                    scrub.vars.totalTime = snap(
                      (iteration.current + progress) * seamlessLoop.duration()
                    );
                    scrub.invalidate().restart();
                    self.wrapping = false;
                  }
                },
              });
            }
          }
        );

        function wrapForward(trigger) {
          iteration.current++;
          trigger.wrapping = true;
          trigger.scroll(trigger.start + 1);
        }

        function scrubTo(totalTime) {
          let progress =
            (totalTime - seamlessLoop.duration() * iteration.current) /
            seamlessLoop.duration();
          if (progress > 1) {
            wrapForward(trigger);
          } else {
            trigger.scroll(
              trigger.start + progress * (trigger.end - trigger.start)
            );
          }
        }

        function buildSeamlessLoop(items, spacing) {
          let overlap = Math.ceil(1 / spacing),
            startTime = items.length * spacing,
            loopTime = (items.length + overlap) * spacing + 1,
            rawSequence = gsap.timeline({ paused: true }),
            seamlessLoop = gsap.timeline({
              paused: true,
              repeat: -1,
              onRepeat() {
                this._time === this._dur && (this._tTime += this._dur - 0.01);
              },
            }),
            l = items.length + overlap * 2,
            time = 0,
            i,
            index,
            item;
          // Create animations for each item
          for (i = 0; i < items.length; i++) {
            index = i % items.length;
            item = items[index];
            time = i * spacing;

            const bottomStackIndex = items.length - 1;
            const bottomStackPosition = {
              top: bottomStackIndex * 20,
              left: bottomStackIndex * 20,
            };

            if (index === 0) {
              rawSequence.to(item, { top: 0, left: 0, immediateRender: false });
              items.forEach((currentItem, idx) => {
                // Explicitly set the zIndex
                currentItem.zIndex = items.length - idx;
                rawSequence.set(currentItem, { zIndex: items.length - idx });
              });
            }

            // Log the zIndex after it has been set
            rawSequence
              .to(item, {
                opacity: 1,
                yPercent: 120,
                scale: 1.15,
                ease: "power1.in",
                top: 0,
                left: 0,
                immediateRender: false,
              })
              .to(item, {
                opacity: 0.8,
                yPercent: 0,
                scale: 1,
                top: bottomStackPosition.top,
                left: bottomStackPosition.left,
                ease: "power1.in",
                immediateRender: false,
              });
            items.forEach((currentItem, idx) => {
              let newPosition, newZIndex;
              if (idx === index) {
                // The top card moves to the back of the stack
                newPosition = {
                  top: bottomStackPosition.top,
                  left: bottomStackPosition.left,
                };
                newZIndex = 1; // Set to lowest zIndex
              } else {
                // Other cards move up in the stack
                const adjustedZIndex = items[idx].zIndex + 1;

                // Ensure the card directly below the top card moves to the top
                if (idx === (index + 1) % items.length) {
                  newPosition = {
                    top: 0,
                    left: 0,
                  };
                } else {
                  newPosition = {
                    top: (items.length - adjustedZIndex) * 20,
                    left: (items.length - adjustedZIndex) * 20,
                  };
                }
                newZIndex = adjustedZIndex;
              }
              currentItem.zIndex = newZIndex;
              rawSequence
                .to(
                  currentItem,
                  {
                    top: newPosition.top,
                    left: newPosition.left,
                    opacity: 1,
                    scale: 1,
                    ease: "power1.in",
                    immediateRender: false,
                  },
                  "<"
                )
                .set(currentItem, { zIndex: newZIndex }, "<"); // Update zIndex
            });

            i <= items.length && seamlessLoop.add("label" + i, time);
          }

          // Set up seamless looping by animating the rawSequence
          const buffer = (items.length - 1) * 0.75;
          rawSequence.time(startTime);
          seamlessLoop
            .to(rawSequence, {
              time: loopTime + buffer,
              duration: loopTime - startTime,
              ease: "none",
            })
            .fromTo(
              rawSequence,
              { time: overlap * spacing + 1 },
              {
                time: startTime,
                duration: startTime - (overlap * spacing + 1),
                immediateRender: false,
                ease: "none",
              }
            );

          return seamlessLoop;
        }
      });
      // const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (
        animatedItems &&
        results &&
        results.length > 1 &&
        !isInitialized.current
      ) {
        buildInfiniteLoop();
        isInitialized.current = true; // Mark as initialized
      }
    },
    [results]
  );
};
