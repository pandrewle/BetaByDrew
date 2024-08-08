import "./HomePage.css";
import Parallax from "../components/Parallax";
import AboutPage from "./AboutPage";

function HomePage() {
  return (
    <>
      <Parallax />
      <AboutPage />
      <div id="contact" className="flex flex-row gap-4 mb-8" />
      <div id="about" className="flex flex-row gap-4 mb-8" />
    </>
  );
}

export default HomePage;
