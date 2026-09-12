import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

function VerifyOTP() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isNight } = useTheme();

  const initialEmail = searchParams.get("email") || localStorage.getItem("verificationEmail") || "";
  const [email, setEmail] = useState(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(!initialEmail);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = useRef([]);

  // Auto focus first OTP input when email is set and not editing
  useEffect(() => {
    if (email && !isEditingEmail) {
      inputRefs.current[0]?.focus();
    }
  }, [email, isEditingEmail]);

  // Sync to localStorage when email changes
  useEffect(() => {
    if (email) {
      localStorage.setItem("verificationEmail", email);
    }
  }, [email]);

  // Resend timer countdown
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

    // Move to next input box
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

    if (!email.trim()) {
      setError("Please specify a valid email address.");
      setIsEditingEmail(true);
      return;
    }

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const response = await API.post("/users/verify-otp", {
        email: email.trim(),
        otp_code: otpCode,
      });

      setSuccess(response.data?.message || "Account verified successfully! Redirecting to login...");
      localStorage.removeItem("verificationEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid or expired OTP. Please verify the code or request a new one."
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first.");
      setIsEditingEmail(true);
      return;
    }

    if (resendTimer > 0) return;

    try {
      setError("");
      setSuccess("");
      setResending(true);

      const response = await API.post("/users/resend-otp", {
        email: email.trim(),
      });

      setSuccess(response.data?.message || "A fresh verification code has been dispatched to your email!");
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
      setIsEditingEmail(false);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to resend OTP. Please check the email address and try again."
      );
    } finally {
      setResending(false);
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
              ✉️
            </div>
            <h1
              className={`font-heading mt-6 text-3xl font-extrabold tracking-tight ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Verify Security Code
            </h1>
            <p
              className={`mt-2 text-xs font-medium ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Enter the 6-digit confirmation code sent to your email
            </p>
          </div>

          {/* Form Card */}
          <div
            className={`rounded-3xl p-8 shadow-2xl backdrop-blur-2xl transition-all ${
              isNight
                ? "border border-white/10 bg-slate-900/80 text-white"
                : "border border-slate-200 bg-white/90 text-slate-900 shadow-slate-300/50"
            }`}
          >
            {/* Target Email Selector / Display */}
            <div
              className={`mb-6 rounded-2xl border p-3.5 flex items-center justify-between gap-3 ${
                isNight ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
              }`}
            >
              {isEditingEmail ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className={`flex-1 bg-transparent text-xs font-bold outline-none ${
                      isNight ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!email.trim() || resending}
                    className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white transition hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                  >
                    {resending ? "Sending..." : "Send Code"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isNight ? "text-slate-400" : "text-slate-500"
                    }`}>
                      Target Account
                    </p>
                    <p className="text-xs font-bold text-indigo-400 truncate">
                      {email || "No email selected"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingEmail(true)}
                    className={`text-[11px] font-semibold underline underline-offset-2 ${
                      isNight ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Change
                  </button>
                </>
              )}
            </div>

            {/* Status Messages */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-400">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400">
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label
                className={`mb-4 block text-center text-xs font-bold uppercase tracking-wider ${
                  isNight ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Enter 6-Digit Passcode
              </label>

              {/* OTP Boxes */}
              <div className="flex justify-center gap-2.5 sm:gap-3" onPaste={handlePaste}>
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
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`h-12 w-11 sm:h-14 sm:w-12 rounded-2xl border text-center font-heading text-xl font-bold outline-none transition-all duration-200 ${
                      digit
                        ? isNight
                          ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-lg shadow-indigo-600/20"
                          : "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                        : isNight
                        ? "border-white/10 bg-slate-950 text-white focus:border-indigo-500 focus:bg-slate-900"
                        : "border-slate-300 bg-slate-50 text-slate-900 focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.join("").length !== 6 || !email.trim()}
                className="mt-8 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-4 font-heading font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01] hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying Code...
                  </>
                ) : (
                  <>
                    Confirm & Activate Account →
                  </>
                )}
              </button>
            </form>

            {/* Resend Action */}
            <div
              className={`mt-6 text-center border-t pt-6 ${
                isNight ? "border-white/5" : "border-slate-100"
              }`}
            >
              <p
                className={`text-xs ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Didn't receive the email code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || resending || !email.trim()}
                className={`mt-2 text-xs font-bold transition cursor-pointer ${
                  resendTimer > 0 || !email.trim()
                    ? isNight ? "cursor-not-allowed text-slate-500" : "cursor-not-allowed text-slate-400"
                    : "text-indigo-500 hover:text-indigo-600 underline underline-offset-4"
                }`}
              >
                {resending
                  ? "Dispatching new code..."
                  : resendTimer > 0
                  ? `Resend security code in ${resendTimer}s`
                  : "Resend verification email"}
              </button>
            </div>

            {/* Security Guarantee */}
            <div
              className={`mt-4 flex items-center justify-center gap-2 text-[11px] ${
                isNight ? "text-slate-500" : "text-slate-400"
              }`}
            >
              <span>🔒</span>
              <span>256-Bit SSL Encrypted Verification</span>
            </div>
          </div>

          {/* Back to sign in */}
          <p
            className={`mt-6 text-center text-xs ${
              isNight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Already verified?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-500 hover:text-indigo-600 underline underline-offset-4"
            >
              Back to Sign In
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
}

export default VerifyOTP;