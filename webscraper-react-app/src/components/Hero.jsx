import React, { useState, forwardRef } from "react";
import { SearchBar } from "../components/SearchBar";

const Hero = forwardRef(({ setSearchSubmitted }, ref) => {
  return (
    <div className="hero" ref={ref}>
      <h1 className="hero-text">Discover the best prices for your gear.</h1>
      <SearchBar setSearchSubmitted={setSearchSubmitted} />
    </div>
  );
});

export default Hero;
