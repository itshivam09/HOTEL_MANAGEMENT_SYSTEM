import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";

function MyBookings() {
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

  // --------------------------------
  // TODAY'S DATE
  // --------------------------------

  const today = new Date().toISOString().split("T")[0];


  // --------------------------------
  // FETCH MY BOOKINGS
  // --------------------------------

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/bookings/my");

      setBookings(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };


  // --------------------------------
  // LOAD BOOKINGS
  // --------------------------------

  useEffect(() => {
    fetchBookings();
  }, []);


  // --------------------------------
  // CREATE BOOKING
  // --------------------------------

  const handleBooking = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!roomId) {
      setError("No room selected.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    try {
      setBookingLoading(true);

      /*
        Backend expects datetime.
        We add 12:00 PM so the date is safely
        converted to a datetime.
      */

      const checkInDate = new Date(
        `${checkIn}T12:00:00`
      );

      const checkOutDate = new Date(
        `${checkOut}T12:00:00`
      );

      await API.post("/bookings/", {
        room_id: Number(roomId),
        check_in: checkInDate.toISOString(),
        check_out: checkOutDate.toISOString(),
      });

      setSuccess(
        "🎉 Your booking has been confirmed successfully!"
      );

      setCheckIn("");
      setCheckOut("");

      // Refresh bookings
      await fetchBookings();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to create booking."
      );
    } finally {
      setBookingLoading(false);
    }
  };


  // --------------------------------
  // CANCEL BOOKING
  // --------------------------------

  const handleCancel = async (bookingId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await API.put(
        `/bookings/${bookingId}/cancel`
      );

      setSuccess(
        "Booking cancelled successfully."
      );

      await fetchBookings();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to cancel booking."
      );
    }
  };


  // --------------------------------
  // FORMAT DATE
  // --------------------------------

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">

        {/* =========================
            PAGE HEADER
        ========================== */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Reservations
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            My Bookings
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your hotel reservations and book your next stay.
          </p>

        </div>


        {/* =========================
            ERROR MESSAGE
        ========================== */}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            <span className="text-xl">
              ⚠️
            </span>

            <span>
              {error}
            </span>
          </div>
        )}


        {/* =========================
            SUCCESS MESSAGE
        ========================== */}

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
            <span className="text-xl">
              ✓
            </span>

            <span>
              {success}
            </span>
          </div>
        )}


        {/* =========================
            BOOKING FORM
        ========================== */}

        {roomId && (
          <section className="mb-12 overflow-hidden rounded-3xl border border-white/10 bg-slate-900">

            {/* Form Header */}

            <div className="border-b border-white/10 bg-gradient-to-r from-indigo-950/50 to-slate-900 p-8">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-3xl">
                  🏨
                </div>

                <div>

                  <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                    New Reservation
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Book Your Stay
                  </h2>

                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-400">

                <span className="rounded-lg bg-white/5 px-3 py-2">
                  🛏️ Room #{roomId}
                </span>

                {hotelId && (
                  <span className="rounded-lg bg-white/5 px-3 py-2">
                    🏨 Hotel #{hotelId}
                  </span>
                )}

              </div>

            </div>


            {/* Form */}

            <form
              onSubmit={handleBooking}
              className="p-8"
            >

              <div className="grid gap-6 md:grid-cols-2">

                {/* CHECK-IN */}

                <div>

                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Check-in
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                      📅
                    </span>

                    <input
                      type="date"
                      value={checkIn}
                      min={today}
                      onChange={(e) => {
                        setCheckIn(e.target.value);

                        // Reset checkout if it becomes invalid
                        if (
                          checkOut &&
                          e.target.value >= checkOut
                        ) {
                          setCheckOut("");
                        }
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 pl-12 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Select your arrival date
                  </p>

                </div>


                {/* CHECK-OUT */}

                <div>

                  <label className="mb-3 block text-sm font-semibold text-slate-300">
                    Check-out
                  </label>

                  <div className="relative">

                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                      📅
                    </span>

                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || today}
                      onChange={(e) =>
                        setCheckOut(e.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 pl-12 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Select your departure date
                  </p>

                </div>

              </div>


              {/* INFO */}

              <div className="mt-6 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 p-5">

                <div className="flex gap-3">

                  <span className="text-xl">
                    💡
                  </span>

                  <div>

                    <p className="font-medium text-slate-200">
                      Booking information
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Your room will be checked for availability
                      before the booking is confirmed.
                    </p>

                  </div>

                </div>

              </div>


              {/* CONFIRM BUTTON */}

              <button
                type="submit"
                disabled={bookingLoading}
                className="mt-6 w-full rounded-2xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Confirming Booking...
                  </span>
                ) : (
                  "🎉 Confirm Booking"
                )}
              </button>

            </form>

          </section>
        )}


        {/* =========================
            MY BOOKINGS
        ========================== */}

        <section>

          <div className="mb-6">

            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              History
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Your Reservations
            </h2>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="flex justify-center py-20">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />

            </div>

          ) : bookings.length === 0 ? (

            /* NO BOOKINGS */

            <div className="rounded-3xl border border-white/10 bg-white/5 p-14 text-center">

              <div className="text-6xl">
                🏨
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No bookings yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-slate-500">
                You haven't made any hotel reservations yet.
                Browse our hotels and book your perfect stay.
              </p>

            </div>

          ) : (

            /* BOOKINGS LIST */

            <div className="space-y-5">

              {bookings.map((booking) => (

                <div
                  key={booking.id}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6 transition hover:border-white/20"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    {/* LEFT */}

                    <div className="flex gap-5">

                      <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-2xl sm:flex">
                        🛏️
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-xl font-bold">
                            Booking #{booking.id}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "confirmed"
                                ? "bg-green-500/10 text-green-400"
                                : booking.status === "cancelled"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {booking.status}
                          </span>

                        </div>


                        <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">

                          <div>
                            <span className="text-slate-600">
                              ROOM
                            </span>

                            <p className="mt-1 text-white">
                              Room #{booking.room_id}
                            </p>
                          </div>


                          <div>
                            <span className="text-slate-600">
                              CHECK-IN
                            </span>

                            <p className="mt-1 text-white">
                              {formatDate(booking.check_in)}
                            </p>
                          </div>


                          <div>
                            <span className="text-slate-600">
                              CHECK-OUT
                            </span>

                            <p className="mt-1 text-white">
                              {formatDate(booking.check_out)}
                            </p>
                          </div>

                        </div>

                      </div>

                    </div>


                    {/* RIGHT */}

                    <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">

                      <p className="text-sm text-slate-500">
                        Total Price
                      </p>

                      <p className="mt-1 text-3xl font-bold text-indigo-400">
                        ₹{booking.total_price}
                      </p>


                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() =>
                            handleCancel(booking.id)
                          }
                          className="mt-4 rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                        >
                          Cancel Booking
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