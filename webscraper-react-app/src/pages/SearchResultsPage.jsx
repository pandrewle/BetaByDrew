import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SearchResultsPage.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import NavBar from "../components/navbar";
import Loader from "../components/Loading";
import ImageSlider from "../components/ImageSlider";
gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

function SearchResults() {
  const [searchSubmitted, setSearchSubmitted] = useState(true);
  const [isPending, setIsPending] = useState(true);
  const [results, setResults] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(true);
  const cardRefs = useRef([]);
  const container = useRef();
  const { contextSafe } = useGSAP({ scope: container.current });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const input = queryParams.get("query");

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (input) {
      const savedResults = localStorage.getItem(input);
      if (savedResults) {
        setResults(JSON.parse(savedResults));
        setIsPending(false);
        setDisplayLoader(false);
      } else {
        setIsPending(true);
        setDisplayLoader(true);
        fetch("http://127.0.0.1:5000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: input }),
          signal: signal,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            setResults(data);
            localStorage.setItem(input, JSON.stringify(data));
            setIsPending(false);
            setDisplayLoader(false);
          })
          .catch((error) => {
            if (error.name !== "AbortError") {
              console.error("Error fetching search results: ", error);
              setIsPending(false);
              setDisplayLoader(false);
            }
          });

        return () => {
          abortController.abort();
        };
      }
      return () => {
        abortController.abort(); // Ensure fetch is aborted if the component unmounts
      };
    }
  }, [input]);

  const cardAnimation = contextSafe(() => {
    // Calculate the total scroll length needed for all cards
    const totalScrollLength = results.length * 1000; // Adjust the multiplier based on animation duration

    // Create a GSAP timeline and configure it with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pinned-container", // Parent container that includes everything
        pin: true,
        start: "top top",
        end: `+=${totalScrollLength}`, // Match the total length to the number of cards
        scrub: 1,
        markers: true,
      },
    });

    results.forEach((result, index) => {
      const currentCard = `.result-item:nth-child(${index + 1})`;
      if (index === 0) {
        tl.set(currentCard, { zIndex: 1 });
        tl.to(currentCard, {
          opacity: 1,
          scale: 1,
        });
      } else {
        const previousCard = `.result-item:nth-child(${index})`;
        const previousPosition = { top: index * 20, left: index * 20 };
        const currentPosition = {
          top: (index - 1) * 20,
          left: (index - 1) * 20,
        };

        tl.to(previousCard, {
          opacity: 1,
          yPercent: 120,
          scale: 1.15,
        })
          .set(currentCard, { zIndex: 2 })
          .to(previousCard, {
            opacity: 0.25,
            yPercent: 0,
            scale: 1,
            top: previousPosition.top,
            left: previousPosition.left,
          })
          .to(
            currentCard,
            {
              top: currentPosition.top,
              left: currentPosition.left,
              opacity: 1,
              scale: 1,
            },
            "<"
          )
          .to(currentCard, {
            opacity: 1,
            scale: 1,
          })
          .set(previousCard, { zIndex: 0 });
      }
    });
  });

  useEffect(() => {
    if (results) {
      cardAnimation();
    }
  }, [results]);

  return (
    <>
      <NavBar
        searchSubmitted={searchSubmitted}
        setSearchSubmitted={setSearchSubmitted}
      />
      <div className="pinned-container" ref={container}>
        <div className="SearchResults flex flex-col lg:flex-col gap-0 lg:items-center lg:justify-start">
          <h1 className="header text-2xl font-bold my-4">
            Search Results for "{input}"
          </h1>
          {displayLoader && <Loader isPending={isPending} />}
          {!isPending && !displayLoader && (
            <div className="Results flex flex-col items-center lg:flex-row lg:w-full lg:items-start">
              <ImageSlider results={results} />
              <div className="results-container lg:w-1/2 flex flex-col gap-8 items-center m-4 relative">
                {results && results.length > 0 ? (
                  results
                    .filter((result) => result.price > 0) // Filter out items with price of 0.00
                    .map((result, index) => (
                      <div
                        key={index}
                        className={`result-item absolute p-4 flex flex-col justify-center gap-1 lg:gap-4 w-[80%] rounded-md transform ${
                          index === 0 ? "z-10" : "z-0"
                        }`}
                        ref={(el) => (cardRefs.current[index] = el)}
                        style={{
                          top: `${index * 20}px`,
                          left: `${index * 20}px`,
                        }}
                      >
                        {index === 0 && (
                          <div className="flex w-full items-start justify-end mb-4">
                            <span className="absolute top-0 right-0 bg-blue-600 text-white text-s font-bold py-1 px-2 rounded-tr-md rounded-bl-md">
                              Lowest Price!
                            </span>
                          </div>
                        )}
                        <div className="product-info flex items-center gap-4">
                          <img
                            src={result.logo}
                            alt={`${result.websiteName} logo`}
                            className="w-24 h-24 object-contain"
                          />
                          <div className="results-info">
                            <h2 className="text-xl font-bold">
                              {result.product}
                            </h2>
                            <p className="text-lg font-bold text-blue-500">
                              ${result.price}
                            </p>
                            <a
                              href={result.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:underline hover:text-white"
                            >
                              View Product
                            </a>
                          </div>
                        </div>
                        <h3 className="size-header text-lg font-semibold mt-4 flex">
                          Sizes:
                        </h3>
                        <div className="results-sizes flex flex-wrap gap-2">
                          {result.productSizes &&
                          result.productSizes.length > 0 ? (
                            result.productSizes.map((size, sizeIndex) => (
                              <span
                                key={sizeIndex}
                                className="size-item px-2 py-1 border rounded-md"
                              >
                                {size}
                              </span>
                            ))
                          ) : (
                            <span className="no-sizes text-gray-500">
                              No sizes available
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-lg text-gray-500">No results found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResults;
