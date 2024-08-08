import React, { useState, forwardRef } from "react";
import { SearchBar } from "../components/SearchBar";

const Hero = forwardRef((props, ref) => {
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  return (
    <div className="hero" ref={ref}>
      <h1 className="hero-text">Discover the best prices for your gear.</h1>
      <SearchBar
        searchSubmitted={searchSubmitted}
        setSearchSubmitted={setSearchSubmitted}
      />
    </div>
  );
});

export default Hero;
