import React, { useContext } from "react";
import { SearchBar } from "../components/SearchBar";
import { SearchSubmitContext } from "../components/AppContext";

const Hero = () => {
  const { searchSubmitted, setSearchSubmitted } =
    useContext(SearchSubmitContext);
  return (
    <div className="w-screen h-[110vh] relative flex justify-center items-start text-secondaryColor overflow-hidden">
      <img
        src="assets/hero-background.jpg"
        alt="Hero Image"
        className="absolute w-full h-full object-cover"
      />
      <div className="blur-overlay absolute bottom-[-5vh] w-[120%] h-[10vh] bg-primarycolor blur-[15px] opacity-100 z-[10]"></div>
      <div className="w-full h-[600px] flex flex-col justify-center items-center md:px-12 px-4">
        <h1 className="text-[40px] font-bold text-center z-[1]">
          Discover the best prices for your gear.
        </h1>
        <SearchBar setSearchSubmitted={setSearchSubmitted} />
      </div>
    </div>
  );
};

export default Hero;
