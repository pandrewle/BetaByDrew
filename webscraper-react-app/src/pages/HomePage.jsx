import "./HomePage.css";
import Parallax from "../components/Parallax";
import AboutPage from "./AboutPage";
import transition from "../components/PageTransitions";

function HomePage() {
  return (
    <>
      <Parallax />
      <AboutPage />
    </>
  );
}

export default transition(HomePage);
