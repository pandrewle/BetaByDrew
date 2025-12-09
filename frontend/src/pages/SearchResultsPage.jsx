import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./SearchResultsPage.css";
import transition from "../components/PageTransitions.jsx";
import Loader from "../components/Loading";
import ImageSlider from "../components/ImageSlider";
import ResultsCard from "../components/ResultsCard";
import { useInfiniteLoop } from "../components/InfiniteLoop";
import { API_BASE_URL } from "../config";

function SearchResults() {
  const [isPending, setIsPending] = useState(true);
  const [results, setResults] = useState([]);
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
      setIsPending(true);
      setDisplayLoader(true);

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/search`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ product: input }),
              signal: signal,
            }
          );

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let resultString = "";
          let newResults = [];

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            resultString += decoder.decode(value, { stream: true });

            // Process each chunk
            resultString.split("\n").forEach((line) => {
              if (line) {
                try {
                  const json = JSON.parse(line);
                  if (json.results) {
                    newResults = json.results;
                  }
                  // Handle other data if necessary
                } catch (e) {
                  console.error("Error parsing JSON:", e);
                }
              }
            });
          }

          setResults(newResults);
          localStorage.setItem(input, JSON.stringify(newResults));
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Error fetching search results: ", error);
          }
        } finally {
          setIsPending(false);
        }
      };

      fetchData();

      return () => {
        abortController.abort();
      };
    }
  }, [input]);

  useInfiniteLoop(results, cardRefs, spacing, container);

  return (
    <>
      <div className="pinned-container" ref={container}>
        <div className="SearchResults flex flex-col lg:flex-col gap-0 lg:items-center lg:justify-start p-4">
          {displayLoader && (
            <div className="w-full h-[100vh] flex flex-col justify-center items-center">
              <Loader
                isPending={isPending}
                setDisplayLoader={setDisplayLoader}
              />
            </div>
          )}
          {!isPending && !displayLoader && (
            <>
              <h1 className="header text-4xl lg:text-3xl font-bold mt-20 mb-8">
                Search Results for "{input}"
              </h1>
              <div className="Results flex flex-col justify-center items-center lg:flex-row lg:w-full lg:items-start">
                {results && results.length === 0 && (
                  <div className="text-center mt-8 text-2xl font-semibold p-8">
                    Sorry, no results found for "{input}". Please try a
                    different search term.
                  </div>
                )}
                {results && results.length > 0 && (
                  <>
                    <ImageSlider results={results} />
                    <div className="results-container w-full lg:w-1/2 flex flex-col gap-8 justify-center items-center m-8 relative">
                      <ResultsCard results={results} ref={cardRefs} />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default transition(SearchResults);
