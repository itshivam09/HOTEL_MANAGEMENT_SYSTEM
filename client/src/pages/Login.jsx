import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isNight } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isUnverified, setIsUnverified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setIsUnverified(false);
      setLoading(true);

      const loggedInUser = await login(email, password);

      if (loggedInUser.role === "hotel_owner") {
        navigate("/owner");
      } else {
        navigate("/hotels");
      }
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Unable to login. Please check your credentials or verify your account.";
      
      const status = err.response?.status;
      if (status === 403 || message.toLowerCase().includes("verify") || message.toLowerCase().includes("verification")) {
        setIsUnverified(true);
        localStorage.setItem("verificationEmail", email);
      }
      
      setError(message);
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
        <div className="relative w-full max-w-md">
          {/* Header Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-3xl shadow-xl shadow-indigo-600/30">
              🏨
            </div>
            <h1
              className={`font-heading mt-6 text-3xl font-extrabold tracking-tight ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Welcome Back
            </h1>
            <p
              className={`mt-2 text-xs font-medium ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Sign in to manage your luxury bookings or owner properties.
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
            {/* Error / Unverified Notice */}
            {error && (
              <div className={`mb-6 rounded-2xl border p-4 text-xs font-semibold ${
                isUnverified
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base">{isUnverified ? "✉️" : "⚠️"}</span>
                  <div className="flex-1">
                    <p>{error}</p>
                    {isUnverified && (
                      <Link
                        to={`/verify-otp?email=${encodeURIComponent(email)}`}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 border border-amber-500/30 transition hover:bg-amber-500/30"
                      >
                        Enter Verification OTP Code →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 transition ${
                      isNight
                        ? "border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                        : "border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isNight ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
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
              {loading ? "Authenticating..." : "Sign In to Account →"}
            </button>

            {/* Footer switch */}
            <p
              className={`mt-6 text-center text-xs ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Don't have an account yet?{" "}
              <Link
                to="/register"
                className="font-bold text-indigo-500 hover:text-indigo-600 underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;