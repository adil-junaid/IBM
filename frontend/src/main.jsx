import React from "react";
import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Toaster,
} from "react-hot-toast";

import {
  ClerkProvider,
} from "@clerk/clerk-react";

import AuthTokenProvider from "./components/auth/AuthTokenProvider";

import App from "./App";
import "./index.css";

// ========================================
// CLERK CONFIGURATION
// ========================================

const PUBLISHABLE_KEY =
  import.meta.env
    .VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Clerk Publishable Key. Add VITE_CLERK_PUBLISHABLE_KEY to frontend/.env"
  );
}

// ========================================
// RENDER APPLICATION
// ========================================

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={
        PUBLISHABLE_KEY
      }
    >
      {/* Makes Clerk authentication
          token available to API services */}
      <AuthTokenProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            reverseOrder={false}
          />

          <App />
        </BrowserRouter>
      </AuthTokenProvider>
    </ClerkProvider>
  </React.StrictMode>
);