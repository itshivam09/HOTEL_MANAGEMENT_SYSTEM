import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">

      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-xl shadow-slate-900/10 md:px-6">

        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg shadow-md shadow-indigo-200 transition duration-300 group-hover:scale-105">
              🏨
            </div>

            <div className="text-xl font-bold tracking-tight text-slate-900">
              Stay<span className="text-indigo-600">Easy</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Home */}
            <Link
              to="/"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 md:px-4"
            >
              Home
            </Link>

            {/* Hotels */}
            <Link
              to="/hotels"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 md:px-4"
            >
              Hotels
            </Link>

            {user ? (
              <>
                {/* NORMAL USER - MY BOOKINGS */}
                {user.role === "user" && (
                  <Link
                    to="/my-bookings"
                    className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 md:block"
                  >
                    📋 My Bookings
                  </Link>
                )}

                {/* OWNER DASHBOARD */}
                {user.role === "hotel_owner" && (
                  <Link
                    to="/owner"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
                  >
                    🏨 Owner Dashboard
                  </Link>
                )}

                {/* User */}
                <div className="ml-2 hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {user.role === "hotel_owner"
                        ? "Hotel Owner"
                        : "Guest"}
                    </p>
                  </div>

                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="ml-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:px-4"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 sm:block"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;