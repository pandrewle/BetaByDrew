import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SearchResultsPage.css";
import NavBar from "../components/navbar";
import Loader from "../components/Loading";
import ImageSlider from "../components/ImageSlider";
import ResultsCard from "../components/ResultsCard";
import { useInfiniteLoop } from "../components/InfiniteLoop";

function SearchResults() {
  const [searchSubmitted, setSearchSubmitted] = useState(true);
  const [isPending, setIsPending] = useState(true);
  const [results, setResults] = useState(null);
  const [displayLoader, setDisplayLoader] = useState(true);
  const cardRefs = useRef([]);
  const container = useRef(null);

  const spacing = 0.1; // spacing of the cards (stagger)

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

  const mockResults = [
    {
      logo: "https://via.placeholder.com/150", // Replace with actual image URL or use a placeholder
      websiteName: "Website A",
      product: "Product A",
      price: 19.99,
      productUrl: "#",
      productSizes: ["S", "M", "L"],
    },
    {
      logo: "https://via.placeholder.com/150",
      websiteName: "Website B",
      product: "Product B",
      price: 24.99,
      productUrl: "#",
      productSizes: ["S", "M"],
    },
    {
      logo: "https://via.placeholder.com/150",
      websiteName: "Website C",
      product: "Product C",
      price: 29.99,
      productUrl: "#",
      productSizes: ["L", "XL"],
    },
    {
      logo: "https://via.placeholder.com/150",
      websiteName: "Website D",
      product: "Product D",
      price: 34.99,
      productUrl: "#",
      productSizes: ["M", "L", "XL"],
    },
    {
      logo: "https://via.placeholder.com/150",
      websiteName: "Website E",
      product: "Product E",
      price: 39.99,
      productUrl: "#",
      productSizes: ["XS", "S"],
    },
  ];

  useInfiniteLoop(results, cardRefs.current, spacing, container.current);

  return (
    <>
      <div className="pinned-container" ref={container}>
        <div className="SearchResults flex flex-col lg:flex-col gap-0 lg:items-center lg:justify-start p-4">
          {displayLoader && <Loader isPending={isPending} />}
          {!isPending && !displayLoader && (
            <>
              <h1 className="header text-4xl font-bold mt-20 mb-8">
                Search Results for "{input}"
              </h1>
              <div className="Results flex flex-col justify-center items-center lg:flex-row lg:w-full lg:items-start">
                {results && <ImageSlider results={results} />}
                <div className="results-container lg:w-1/2 flex flex-col gap-8 justify-center items-center m-4 relative">
                  <ResultsCard results={results} ref={cardRefs} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchResults;
