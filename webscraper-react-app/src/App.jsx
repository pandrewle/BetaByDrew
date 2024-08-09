import React from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage.jsx";
import SearchResults from "./pages/SearchResultsPage.jsx";
import NavBar from "./components/navbar.jsx";
import ScrollToHashElement from "./components/ScrollToHashElement.js";
import { AppProviders } from "./components/AppContext.jsx";

function App() {
  const location = useLocation();

  return (
    <AppProviders>
      <NavBar />
      <ScrollToHashElement />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<HomePage />} />
          <Route path="/searchResults" element={<SearchResults />} />
        </Routes>
      </AnimatePresence>
    </AppProviders>
  );
}

export default App;
