import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext";
import "./SearchBar.css";

export const SearchBar = ({ searchSubmitted, setSearchSubmitted }) => {
  const { input, setInput } = useContext(SearchContext);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setTransitionEnabled(true); // Enable transition for smooth animation
    setSearchSubmitted(true);

    // // Assuming the transitioning element is the div with class "wrap"
    const wrapElement = document.querySelector(".wrap");

    const navigateToResults = () => {
      navigate(`/searchResults?query=${input}`); // Include search query in the URL
    };

    if (wrapElement) {
      const onTransitionEnd = () => {
        navigateToResults();
        wrapElement.removeEventListener("transitionend", onTransitionEnd); // Clean up
      };

      wrapElement.addEventListener("transitionend", onTransitionEnd);

      // In case the transition event doesn't fire, navigate after a short delay
      setTimeout(() => {
        wrapElement.removeEventListener("transitionend", onTransitionEnd);
        navigateToResults();
      }, 1000); // Adjust the timeout duration as necessary
    } else {
      navigateToResults(); // If wrapElement is not found, navigate immediately
    }
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     setTransitionEnabled(false); // Disable transition on resize
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  const handleClear = () => {
    setInput("");
  };

  return (
    <div
      // className={`wrap ${searchSubmitted ? "search-top" : ""} ${
      //   transitionEnabled ? "transition-enabled" : ""
      // }`}
      className="wrap"
    >
      <div className="grid-container">
        <div className="divONE">
          <form onSubmit={handleSubmit}>
            <div className="search">
              <FaSearch
                className="search-icon"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  handleSubmit(e);
                }}
              />
              <input
                className="search-input"
                type="search"
                placeholder="Search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {input && (
                <FaTimes className="clear-icon" onClick={handleClear} />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
