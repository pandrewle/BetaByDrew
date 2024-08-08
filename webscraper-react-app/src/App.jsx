import React, { useState } from "react";
import { useLocation, Route, Routes, BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage.jsx";
import SearchResults from "./pages/SearchResultsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import transition from "./components/PageTransitions.jsx";
import NavBar from "./components/navbar.jsx";
import { AppProviders } from "./components/AppContext.jsx";

function App() {
  const location = useLocation();
  const AnimatedHomePage = transition(HomePage);
  const AnimatedSearchResults = transition(SearchResults);
  const AnimatedAboutPage = transition(AboutPage);
  const AnimatedContactPage = transition(ContactPage);

  return (
    <>
      <AppProviders>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<AnimatedHomePage />} />
            <Route path="/searchResults" element={<AnimatedSearchResults />} />
            <Route path="/contact" element={<AnimatedContactPage />} />
            <Route path="/about" element={<AnimatedAboutPage />} />
          </Routes>
        </AnimatePresence>
      </AppProviders>
    </>
  );
}

export default App;
