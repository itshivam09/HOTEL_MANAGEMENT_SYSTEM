import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { user, logout } = useAuth();
  const { isNight, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div
        className={`mx-auto max-w-7xl rounded-2xl px-5 py-3.5 backdrop-blur-xl transition-all duration-500 md:px-6 ${
          isNight
            ? "border border-white/10 bg-slate-950/80 text-white shadow-2xl shadow-black/50"
            : "border border-slate-200/80 bg-white/85 text-slate-900 shadow-xl shadow-slate-300/40"
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-xl shadow-lg shadow-indigo-500/25 transition duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
              <span className="drop-shadow">🏨</span>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-bold text-slate-950 shadow">
                ★
              </span>
            </div>

            <div>
              <div
                className={`font-heading text-xl font-bold tracking-tight ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Stay<span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Easy</span>
              </div>
              <p
                className={`text-[10px] font-medium uppercase tracking-widest ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Luxury & Resorts
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/"
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive("/")
                  ? isNight
                    ? "bg-white/10 text-white shadow-inner"
                    : "bg-slate-100 text-indigo-600 shadow-inner font-bold"
                  : isNight
                  ? "text-slate-300 hover:bg-white/5 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Home
            </Link>

            <Link
              to="/hotels"
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive("/hotels")
                  ? isNight
                    ? "bg-white/10 text-white shadow-inner"
                    : "bg-slate-100 text-indigo-600 shadow-inner font-bold"
                  : isNight
                  ? "text-slate-300 hover:bg-white/5 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              Explore Hotels
            </Link>

            {user?.role === "user" && (
              <Link
                to="/my-bookings"
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive("/my-bookings")
                    ? isNight
                      ? "bg-white/10 text-white shadow-inner"
                      : "bg-slate-100 text-indigo-600 shadow-inner font-bold"
                    : isNight
                    ? "text-slate-300 hover:bg-white/5 hover:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                📋 My Bookings
              </Link>
            )}

            {user?.role === "hotel_owner" && (
              <Link
                to="/owner"
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive("/owner")
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : isNight
                    ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                ⚡ Owner Dashboard
              </Link>
            )}
          </div>

          {/* Right Side: Day/Night Toggle & Auth Actions */}
          <div className="hidden items-center gap-3 md:flex">
            
            {/* Day / Night Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              title={isNight ? "Switch to Sunlit Day Mode" : "Switch to Luxury Night Mode"}
              aria-label="Toggle Theme"
              className={`group flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
                isNight
                  ? "border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400/50 shadow-lg shadow-amber-500/10"
                  : "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm"
              }`}
            >
              <span className="text-sm transition-transform duration-300 group-hover:rotate-45">
                {isNight ? "🌙" : "☀️"}
              </span>
              <span>{isNight ? "Night" : "Day"}</span>
            </button>

            {user ? (
              <div
                className={`flex items-center gap-3 border-l pl-4 ${
                  isNight ? "border-white/10" : "border-slate-200"
                }`}
              >
                {/* User Info */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="text-left">
                    <p
                      className={`text-xs font-bold leading-tight ${
                        isNight ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {user.name}
                    </p>
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isNight
                          ? "bg-white/10 text-indigo-300"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {user.role === "hotel_owner" ? "👑 Owner" : "✨ Guest"}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                    isNight
                      ? "border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white"
                      : "border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isNight
                      ? "text-slate-300 hover:bg-white/5 hover:text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] hover:opacity-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Day/Night + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`rounded-xl p-2 text-sm font-bold transition ${
                isNight
                  ? "border border-amber-400/30 bg-amber-400/10 text-amber-300"
                  : "border border-indigo-200 bg-indigo-50 text-indigo-700"
              }`}
            >
              {isNight ? "🌙" : "☀️"}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`rounded-xl border p-2.5 transition ${
                isNight
                  ? "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`mt-4 border-t pt-4 md:hidden ${
              isNight ? "border-white/10" : "border-slate-200"
            }`}
          >
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  isActive("/")
                    ? isNight
                      ? "bg-white/10 text-white"
                      : "bg-slate-100 text-indigo-600 font-bold"
                    : isNight
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/hotels"
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  isActive("/hotels")
                    ? isNight
                      ? "bg-white/10 text-white"
                      : "bg-slate-100 text-indigo-600 font-bold"
                    : isNight
                    ? "text-slate-300"
                    : "text-slate-700"
                }`}
              >
                Explore Hotels
              </Link>
              {user?.role === "user" && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  📋 My Bookings
                </Link>
              )}
              {user?.role === "hotel_owner" && (
                <Link
                  to="/owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  👑 Owner Dashboard
                </Link>
              )}

              <div
                className={`mt-2 border-t pt-3 ${
                  isNight ? "border-white/10" : "border-slate-200"
                }`}
              >
                {user ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          isNight ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {user.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isNight ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="rounded-xl bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-400"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex-1 rounded-xl border py-2.5 text-center text-sm font-semibold ${
                        isNight
                          ? "border-white/10 text-white"
                          : "border-slate-300 text-slate-800"
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;