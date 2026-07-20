import { NavLink } from "react-router-dom";

import {
  FiHome,
  FiUpload,
  FiMessageSquare,
  FiClock,
  FiSettings,
} from "react-icons/fi";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FiHome />,
    end: true,
  },
  {
    name: "Upload",
    path: "/dashboard/upload",
    icon: <FiUpload />,
  },
  {
    name: "Chat",
    path: "/dashboard/chat",
    icon: <FiMessageSquare />,
  },
  {
    name: "History",
    path: "/dashboard/history",
    icon: <FiClock />,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: <FiSettings />,
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white p-6">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">
        AI Research
      </h1>

      {/* Navigation */}
      <nav className="mt-10 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;