import React, { useState } from "react";
import { SearchBar } from "../components/SearchBar";

const Hero = ({ setSearchSubmitted }) => {
  return (
    <div className="hero">
      <img
        src="assets/hero-background.jpg"
        alt="Hero Image"
        className="hero-image"
      />
      <div className="blur-overlay"></div>
      <div className="hero-text-container md:px-12 px-4">
        <h1 className="hero-text">Discover the best prices for your gear.</h1>
        <SearchBar setSearchSubmitted={setSearchSubmitted} />
      </div>
    </div>
  );
};

export default Hero;
