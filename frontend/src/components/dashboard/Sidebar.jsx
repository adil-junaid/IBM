import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUpload,
  FiMessageSquare,
  FiClock,
  FiSettings,
} from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: <FiHome /> },
  { name: "Upload", path: "/upload", icon: <FiUpload /> },
  { name: "Chat", path: "/chat", icon: <FiMessageSquare /> },
  { name: "History", path: "/history", icon: <FiClock /> },
  { name: "Settings", path: "/settings", icon: <FiSettings /> },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 p-6">
      <h1 className="text-2xl font-bold text-blue-600">
        AI Research
      </h1>

      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;