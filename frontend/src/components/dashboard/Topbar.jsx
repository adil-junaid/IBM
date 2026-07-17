import { FiBell, FiUser } from "react-icons/fi";

const Topbar = () => {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 hover:bg-slate-100">
          <FiBell size={20} />
        </button>

        <button className="rounded-full p-2 hover:bg-slate-100">
          <FiUser size={20} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;