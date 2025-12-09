import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/navbar.jsx";
import ScrollToHashElement from "./components/ScrollToHashElement.js";
import { AppProviders } from "./components/AppContext.jsx";
import Spinner from "./components/spinner.jsx";

const HomePage = lazy(() =>
  wait(1000).then(() => import("./pages/HomePage.jsx"))
);
const SearchResults = lazy(() =>
  wait(1000).then(() => import("./pages/SearchResultsPage.jsx"))
);
const Explore = lazy(() =>
  wait(1000).then(() => import("./pages/ExplorePage.jsx"))
);

function App() {
  const location = useLocation();

  return (
    <AppProviders>
      <ScrollToHashElement />
      <NavBar />
      <Suspense fallback={<Spinner />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<HomePage />} />
            <Route path="/searchResults" element={<SearchResults />} />
            <Route path="/explore" element={<Explore isFullPage={true} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <ScrollToHashElement />
    </AppProviders>
  );
}

export default App;

function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
