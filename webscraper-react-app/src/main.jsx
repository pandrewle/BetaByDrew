import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";

import "./index.css";

//   {
//     path: "/",
//     element: <AnimatedHomePage />,
//     errorElement: <NotFoundPage />,
//   },
//   {
//     path: "/searchResults",
//     element: <AnimatedSearchResults />,
//   },
//   {
//     path: "/about",
//     element: <AnimatedAboutPage />,
//   },
//   {
//     path: "/contact",
//     element: <AnimatedContactPage />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
