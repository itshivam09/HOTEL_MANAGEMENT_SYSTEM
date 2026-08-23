import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();

  const email = localStorage.getItem("verificationEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef([]);

  // Auto focus first input
  useEffect(() => {
    if (email) {
      inputRefs.current[0]?.focus();
    }
  }, [email]);

  // Resend timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");
    setSuccess("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste complete OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", "", ""];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      await API.post("/users/verify-otp", {
        email: email,
        otp_code: otpCode,
      });

      setSuccess("Account verified successfully!");

      localStorage.removeItem("verificationEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Invalid or expired OTP."
      );

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      setError("");
      setSuccess("");

      await API.post("/users/resend-otp", {
        email: email,
      });

      setSuccess("A new verification code has been sent!");

      setResendTimer(30);

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to resend OTP. Please try again."
      );
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">

          {/* Background decoration */}
          <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-2xl shadow-slate-200">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-4xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              No verification request found
            </h1>

            <p className="mt-3 leading-7 text-slate-500">
              Your verification session could not be found.
              Please register your account first.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Register Account
              <span className="ml-2">→</span>
            </Link>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-10 pt-32">

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">

          <div className="absolute -left-20 top-20 h-80 w-80 animate-pulse rounded-full bg-indigo-200/40 blur-3xl" />

          <div
            className="absolute -right-20 top-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-200/40 blur-3xl"
            style={{ animationDelay: "1s" }}
          />

          <div
            className="absolute bottom-0 left-1/3 h-72 w-72 animate-pulse rounded-full bg-blue-200/30 blur-3xl"
            style={{ animationDelay: "2s" }}
          />

        </div>

        {/* Main Card */}
        <div className="relative w-full max-w-lg">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/80">

            {/* Top Gradient */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

            <div className="p-8 sm:p-10">

              {/* Icon */}
              <div className="text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl shadow-inner">
                  ✉️
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                  Verify your email
                </h1>

                <p className="mt-3 text-slate-500">
                  We've sent a 6-digit verification code to
                </p>

                <p className="mt-2 font-semibold text-indigo-600 break-all">
                  {email}
                </p>

              </div>

              {/* Status Messages */}
              {error && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  <span className="text-lg">⚠️</span>

                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600">
                  <span className="text-lg">✓</span>

                  <p>{success}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8">

                <label className="mb-4 block text-center text-sm font-semibold text-slate-700">
                  Enter verification code
                </label>

                {/* OTP Boxes */}
                <div
                  className="flex justify-center gap-2"
                  onPaste={handlePaste}
                >

                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleChange(e.target.value, index)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, index)
                      }
                      className={`h-11 w-10 rounded-lg border-2 bg-slate-50 text-center text-lg font-bold text-slate-900 outline-none transition-all duration-200 ${
                        digit
                          ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                          : "border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                      }`}
                    />
                  ))}

                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                  className="mt-8 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >

                  {loading ? (
                    <>
                      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Account
                      <span className="ml-2">→</span>
                    </>
                  )}

                </button>

              </form>

              {/* Resend */}
              <div className="mt-7 text-center">

                <p className="text-sm text-slate-500">
                  Didn't receive the code?
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className={`mt-2 text-sm font-semibold transition ${
                    resendTimer > 0
                      ? "cursor-not-allowed text-slate-400"
                      : "text-indigo-600 hover:text-indigo-700"
                  }`}
                >
                  {resendTimer > 0
                    ? `Resend code in ${resendTimer}s`
                    : "Resend verification code"}
                </button>

              </div>

              {/* Security Info */}
              <div className="mt-8 border-t border-slate-100 pt-6">

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span>🔒</span>

                  <span>
                    Your verification code is secure and private.
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default VerifyOTP;