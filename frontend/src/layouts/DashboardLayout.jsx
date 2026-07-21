import { useState } from "react";
import { FiMenu } from "react-icons/fi";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="min-h-screen md:ml-72">
        {/* Mobile hamburger button */}
        <div className="flex items-center border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Open navigation menu"
          >
            <FiMenu className="text-2xl" />
          </button>

          <span className="ml-3 font-semibold text-slate-800">
            AI Research
          </span>
        </div>

        {/* Existing topbar */}
        <Topbar />

        {/* Page content */}
        <main className="p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;