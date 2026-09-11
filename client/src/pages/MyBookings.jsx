import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

function MyBookings() {
  const { isNight } = useTheme();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const hotelId = searchParams.get("hotelId");

  const [bookings, setBookings] = useState([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/bookings/my");
      setBookings(response.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to load your reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!roomId) {
      setError("No room selected.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setBookingLoading(true);
      const checkInDate = new Date(`${checkIn}T12:00:00`);
      const checkOutDate = new Date(`${checkOut}T12:00:00`);

      await API.post("/bookings/", {
        room_id: Number(roomId),
        check_in: checkInDate.toISOString(),
        check_out: checkOutDate.toISOString(),
      });

      setSuccess("🎉 Your reservation has been confirmed successfully!");
      setCheckIn("");
      setCheckOut("");
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to confirm booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this reservation?");
    if (!confirmCancel) return;

    try {
      setError("");
      setSuccess("");
      await API.put(`/bookings/${bookingId}/cancel`);
      setSuccess("Reservation cancelled successfully.");
      await fetchBookings();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to cancel reservation.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-32 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold backdrop-blur-md ${
              isNight
                ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                : "border border-indigo-200 bg-indigo-50 text-indigo-700"
            }`}
          >
            <span>📋</span>
            <span>RESERVATIONS & ITINERARIES</span>
          </div>

          <h1
            className={`font-heading mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl ${
              isNight ? "text-white" : "text-slate-900"
            }`}
          >
            My Bookings
          </h1>

          <p
            className={`mt-3 text-sm ${
              isNight ? "text-slate-400" : "text-slate-600"
            }`}
          >
            View your upcoming stays, manage reservation dates, or cancel reservations anytime.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-400 backdrop-blur-xl">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-500 backdrop-blur-xl">
            <span className="text-2xl">✓</span>
            <span className="font-medium text-sm">{success}</span>
          </div>
        )}

        {/* ============================================================
            NEW RESERVATION FORM (IF ROOM SELECTED FROM DETAILS)
        ============================================================ */}
        {roomId && (
          <section
            className={`mb-14 overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl transition-all ${
              isNight
                ? "border border-indigo-500/30 bg-slate-900/90 text-white"
                : "border border-indigo-200 bg-white text-slate-900 shadow-slate-200/60"
            }`}
          >
            <div
              className={`border-b p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isNight
                  ? "border-white/10 bg-gradient-to-r from-indigo-950/60 to-slate-900"
                  : "border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-inner border ${
                    isNight
                      ? "bg-indigo-600/30 border-white/10"
                      : "bg-white border-indigo-200"
                  }`}
                >
                  🏨
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                    New Reservation
                  </span>
                  <h2 className="font-heading text-2xl font-bold">Complete Your Booking</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                <span
                  className={`rounded-xl px-3 py-2 ${
                    isNight ? "bg-white/10 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  🛏️ Room #{roomId}
                </span>
                {hotelId && (
                  <span
                    className={`rounded-xl px-3 py-2 ${
                      isNight ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    🏢 Hotel #{hotelId}
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleBooking} className="p-8">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Check In */}
                <div>
                  <label
                    className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                      isNight ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) {
                        setCheckOut("");
                      }
                    }}
                    required
                    className={`w-full rounded-2xl border px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 ${
                      isNight
                        ? "bg-slate-950 border-white/10 text-white"
                        : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                {/* Check Out */}
                <div>
                  <label
                    className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                      isNight ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className={`w-full rounded-2xl border px-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 ${
                      isNight
                        ? "bg-slate-950 border-white/10 text-white"
                        : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              {/* Night Counter Pill */}
              {calculateNights() > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-xs font-bold text-indigo-500">
                  <span>🌙</span> Total Stay Duration: {calculateNights()} Night{calculateNights() > 1 ? "s" : ""}
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-4 font-heading font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-[1.01] hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {bookingLoading ? "Confirming Reservation..." : "🎉 Confirm & Book Room"}
              </button>
            </form>
          </section>
        )}

        {/* ============================================================
            BOOKING HISTORY LIST
        ============================================================ */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2
              className={`font-heading text-2xl font-bold ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Your Reservation History
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isNight
                  ? "bg-white/5 border border-white/10 text-slate-300"
                  : "bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              {bookings.length} Bookings
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
            </div>
          ) : bookings.length === 0 ? (
            <div
              className={`rounded-3xl p-16 text-center shadow-xl backdrop-blur-xl ${
                isNight
                  ? "border border-white/10 bg-slate-900/60 text-white"
                  : "border border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
              }`}
            >
              <div className="text-6xl mb-4">🧳</div>
              <h3 className="font-heading text-2xl font-bold">No active reservations yet</h3>
              <p
                className={`mt-2 text-sm max-w-md mx-auto ${
                  isNight ? "text-slate-400" : "text-slate-600"
                }`}
              >
                You haven't booked any hotel stays yet. Browse our luxury destinations and book your getaway.
              </p>
              <Link
                to="/hotels"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500"
              >
                Explore Hotels →
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className={`overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl transition ${
                    isNight
                      ? "border border-white/10 bg-slate-900/80 hover:border-white/20 text-white"
                      : "border border-slate-200 bg-white hover:border-indigo-300 text-slate-900 shadow-slate-200/50"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left Details */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl border ${
                          isNight
                            ? "bg-indigo-600/20 border-white/10"
                            : "bg-indigo-50 border-indigo-100"
                        }`}
                      >
                        🛏️
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3
                            className={`font-heading text-xl font-bold ${
                              isNight ? "text-white" : "text-slate-900"
                            }`}
                          >
                            Reservation #{b.id}
                          </h3>
                          <span
                            className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                              b.status === "confirmed"
                                ? "border border-emerald-500/30 bg-emerald-950/70 text-emerald-400"
                                : b.status === "cancelled"
                                ? "border border-red-500/30 bg-red-950/70 text-red-400"
                                : "border border-amber-500/30 bg-amber-950/70 text-amber-400"
                            }`}
                          >
                            {b.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 uppercase font-bold tracking-wider">
                              Room
                            </span>
                            <p
                              className={`font-semibold mt-1 ${
                                isNight ? "text-white" : "text-slate-900"
                              }`}
                            >
                              Room #{b.room_id}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase font-bold tracking-wider">
                              Check-In
                            </span>
                            <p
                              className={`font-semibold mt-1 ${
                                isNight ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {formatDate(b.check_in)}
                            </p>
                          </div>
                          <div>
                            <span className="text-slate-400 uppercase font-bold tracking-wider">
                              Check-Out
                            </span>
                            <p
                              className={`font-semibold mt-1 ${
                                isNight ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {formatDate(b.check_out)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Details & Cancel Action */}
                    <div
                      className={`border-t pt-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0 flex flex-col items-start lg:items-end justify-between ${
                        isNight ? "border-white/10" : "border-slate-100"
                      }`}
                    >
                      <div>
                        <p className="text-xs uppercase font-bold text-slate-400 lg:text-right">
                          Total Amount
                        </p>
                        <p className="font-heading text-3xl font-extrabold text-indigo-500 mt-0.5">
                          ₹{b.total_price}
                        </p>
                      </div>

                      {b.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          Cancel Reservation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default MyBookings;