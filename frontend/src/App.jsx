import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import DashboardHome from "./pages/dashboard/DashboardHome";
import UploadPage from "./pages/dashboard/UploadPage";
import ChatPage from "./pages/dashboard/ChatPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardHome />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard/upload"
        element={
          <DashboardLayout>
            <UploadPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard/chat"
        element={
          <DashboardLayout>
            <ChatPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard/history"
        element={
          <DashboardLayout>
            <HistoryPage />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard/settings"
        element={
          <DashboardLayout>
            <SettingsPage />
          </DashboardLayout>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;