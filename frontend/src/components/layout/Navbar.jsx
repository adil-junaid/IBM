import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          AI Research Assistant
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-700 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-slate-700 hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>

          <Link
            to="/history"
            className="text-slate-700 hover:text-blue-600 transition-colors"
          >
            History
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;