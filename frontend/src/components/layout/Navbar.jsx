function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-blue-600">
          InsightAI
        </h1>

        <div className="space-x-6">

          <a href="/" className="hover:text-blue-600">
            Home
          </a>

          <a href="/dashboard" className="hover:text-blue-600">
            Dashboard
          </a>

          <a href="/login" className="hover:text-blue-600">
            Login
          </a>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;