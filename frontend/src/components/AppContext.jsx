import React, { createContext, useState, useEffect } from "react";

// Create SearchContext
const SearchContext = createContext();

// Create AnimationContext
const AnimationContext = createContext();

const SearchSubmitContext = createContext();

const SearchSubmitProvider = ({ children }) => {
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  return (
    <SearchSubmitContext.Provider
      value={{ searchSubmitted, setSearchSubmitted }}
    >
      {children}
    </SearchSubmitContext.Provider>
  );
};

// Create SearchProvider
const SearchProvider = ({ children }) => {
  const [input, setInput] = useState("");

  return (
    <SearchContext.Provider value={{ input, setInput }}>
      {children}
    </SearchContext.Provider>
  );
};

// Create AnimationProvider
const AnimationProvider = ({ children }) => {
  // Load initial state from localStorage or default to false
  const [animationComplete, setAnimationComplete] = useState(() => {
    const savedState = localStorage.getItem("animationComplete");
    return savedState === "true" ? true : false;
  });

  // Update localStorage whenever animationComplete changes
  useEffect(() => {
    localStorage.setItem("animationComplete", animationComplete);
  }, [animationComplete]);

  return (
    <AnimationContext.Provider
      value={{ animationComplete, setAnimationComplete }}
    >
      {children}
    </AnimationContext.Provider>
  );
};
// Create a combined provider that includes both SearchProvider and AnimationProvider
const AppProviders = ({ children }) => {
  return (
    <SearchProvider>
      <SearchSubmitProvider>
        <AnimationProvider>{children}</AnimationProvider>
      </SearchSubmitProvider>
    </SearchProvider>
  );
};

export { SearchContext, AnimationContext, SearchSubmitContext, AppProviders };
