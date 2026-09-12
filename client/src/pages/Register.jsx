import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { isNight } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      await API.post("/users/register", form);

      // Store email for OTP verification step
      localStorage.setItem("verificationEmail", form.email);
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      <Navbar />

      <main className="relative flex flex-1 items-center justify-center px-6 pt-32 pb-16">
        <div className="relative w-full max-w-lg">
          {/* Header Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-3xl shadow-xl shadow-indigo-600/30">
              ✨
            </div>
            <h1
              className={`font-heading mt-6 text-3xl font-extrabold tracking-tight ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Create Your Account
            </h1>
            <p
              className={`mt-2 text-xs font-medium ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Join StayEasy to book exclusive luxury suites or list your hotel property.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className={`rounded-3xl p-8 shadow-2xl backdrop-blur-2xl transition-all ${
              isNight
                ? "border border-white/10 bg-slate-900/80 text-white"
                : "border border-slate-200 bg-white/90 text-slate-900 shadow-slate-300/50"
            }`}
          >
            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
                ⚠️ {error}
              </div>
            )}

            {/* Role Selection Toggle */}
            <div className="mb-6">
              <label
                className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                  isNight ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Choose Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "user" })}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-4 text-center transition cursor-pointer ${
                    form.role === "user"
                      ? isNight
                        ? "border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-950/50"
                        : "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm font-bold"
                      : isNight
                      ? "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-2xl">🌴</span>
                  <span className="text-xs font-bold">Guest Traveler</span>
                  <span
                    className={`text-[10px] ${
                      isNight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Book stays
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "hotel_owner" })}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl border p-4 text-center transition cursor-pointer ${
                    form.role === "hotel_owner"
                      ? isNight
                        ? "border-purple-500 bg-purple-600/20 text-white shadow-md shadow-purple-950/50"
                        : "border-purple-500 bg-purple-50 text-purple-900 shadow-sm font-bold"
                      : isNight
                      ? "border-white/10 bg-slate-950 text-slate-400 hover:border-white/20"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-2xl">👑</span>
                  <span className="text-xs font-bold">Hotel Owner</span>
                  <span
                    className={`text-[10px] ${
                      isNight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Manage hotels
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 transition ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 transition ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                      : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                  }`}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    required
                    minLength={6}
                    className={`w-full rounded-2xl border px-4 py-3.5 pr-12 text-sm font-semibold outline-none focus:border-indigo-500 transition ${
                      isNight
                        ? "border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                        : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs cursor-pointer ${
                      isNight ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-4 font-heading font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01] hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account & Send OTP →"}
            </button>

            {/* Switch */}
            <p
              className={`mt-6 text-center text-xs ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-500 hover:text-indigo-600 underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;