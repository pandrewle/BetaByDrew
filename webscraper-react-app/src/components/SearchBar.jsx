import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SearchContext, AnimationContext } from "./AppContext";
import "./SearchBar.css";

export const SearchBar = ({ setSearchSubmitted }) => {
  const { input, setInput } = useContext(SearchContext);
  const { animationComplete, setAnimationComplete } =
    useContext(AnimationContext);
  const navigate = useNavigate();

  const navigateToResults = () => {
    console.log("Navigating to search results");
    navigate(`/searchResults?query=${input}`); // Include search query in the URL
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted");
    setSearchSubmitted(true);
    setAnimationComplete(true);
    navigateToResults();
  };

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
