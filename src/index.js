import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthContext.jsx";
import {
  BrowserRouter,
  HashRouter,
} from "react-router-dom";

/**
 * 🔀 AUTO ROUTER SWITCH
 * - GitHub Pages → HashRouter
 * - Vercel / Localhost → BrowserRouter
 */
const Router =
  window.location.hostname.includes("github.io")
    ? HashRouter
    : BrowserRouter;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
