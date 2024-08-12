import "./HomePage.css";
import React, { useContext } from "react";
import Hero from "../components/Hero";
import { SearchSubmitContext } from "../components/AppContext";
import AboutPage from "./AboutPage";
import transition from "../components/PageTransitions";

function HomePage() {
  const { searchSubmitted, setSearchSubmitted } =
    useContext(SearchSubmitContext);
  return (
    <>
      <Hero setSearchSubmitted={setSearchSubmitted} />
      <AboutPage />
    </>
  );
}

export default transition(HomePage);
