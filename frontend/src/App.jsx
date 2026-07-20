import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  SignIn,
} from "@clerk/clerk-react";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import DashboardHome from "./pages/dashboard/DashboardHome";
import UploadPage from "./pages/dashboard/UploadPage";
import ChatPage from "./pages/dashboard/ChatPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

import DashboardLayout from "./layouts/DashboardLayout";

// ========================================
// Protected Dashboard Route
// ========================================

function ProtectedRoute({
  children,
}) {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>

      <SignedOut>
        <Navigate
          to="/login"
          replace
        />
      </SignedOut>
    </>
  );
}

// ========================================
// Login Page
// ========================================

function ClerkLoginPage() {
  return (
    <>
      <SignedIn>
        <Navigate
          to="/dashboard"
          replace
        />
      </SignedIn>

      <SignedOut>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
            background:
              "#f8fafc",
          }}
        >
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </SignedOut>
    </>
  );
}

// ========================================
// Sign Up Page
// ========================================

function ClerkSignUpPage() {
  return (
    <>
      <SignedIn>
        <Navigate
          to="/dashboard"
          replace
        />
      </SignedIn>

      <SignedOut>
        <Navigate
          to="/login"
          replace
        />
      </SignedOut>
    </>
  );
}

// ========================================
// Application Routes
// ========================================

function App() {
  return (
    <Routes>
      {/* Public Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Clerk Login */}
      <Route
        path="/login/*"
        element={
          <ClerkLoginPage />
        }
      />

      {/* Sign Up */}
      <Route
        path="/sign-up/*"
        element={
          <ClerkSignUpPage />
        }
      />

      {/* Dashboard Home */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardHome />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Upload */}
      <Route
        path="/dashboard/upload"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <UploadPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Chat */}
      <Route
        path="/dashboard/chat"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ChatPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* History */}
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HistoryPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SettingsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;