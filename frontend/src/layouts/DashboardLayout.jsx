import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-72">
          <Topbar />

          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;