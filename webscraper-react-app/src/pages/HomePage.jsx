import Hero from "../components/Hero";
import AboutPage from "./AboutPage";
import Explore from "./ExplorePage";
import transition from "../components/PageTransitions";
// import { ReactLenis } from "lenis/react";

function HomePage() {
  return (
    <>
      <Hero />
      <Explore isFullPage={false} />
      <AboutPage />
    </>
  );
}

export default transition(HomePage);
