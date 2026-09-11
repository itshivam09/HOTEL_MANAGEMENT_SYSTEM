import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import API from "../services/api";
import { getHotelGallery, getHotelRating } from "../utils/imageUtils";
import { useTheme } from "../context/ThemeContext";

function HotelDetails() {
  const { hotelId } = useParams();
  const { isNight } = useTheme();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError("");

        // Direct hotel fetch
        const hotelResponse = await API.get(`/hotels/${hotelId}`);
        setHotel(hotelResponse.data);

        // Fetch rooms for this hotel
        const roomsResponse = await API.get(`/rooms/${hotelId}`);
        setRooms(roomsResponse.data || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Unable to load hotel information.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  if (loading) {
    return (
      <div className={`min-h-screen ${isNight ? "text-white" : "text-slate-900"}`}>
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
            <p className={`text-sm font-semibold ${isNight ? "text-slate-400" : "text-slate-500"}`}>
              Loading hotel sanctuary...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className={`min-h-screen ${isNight ? "text-white" : "text-slate-900"}`}>
        <Navbar />
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center px-6">
          <div className="w-full rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center backdrop-blur-xl">
            <div className="text-5xl mb-4">🏨</div>
            <h1 className="font-heading text-2xl font-bold">{error || "Hotel Not Found"}</h1>
            <p className="mt-2 text-sm text-slate-400">The requested property could not be found or has been removed.</p>
            <Link
              to="/hotels"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500"
            >
              ← Back to All Hotels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages = getHotelGallery(hotel);
  const { rating, reviewsCount } = getHotelRating(hotel.id);

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div
          className={`mb-6 flex items-center gap-2 text-xs font-semibold ${
            isNight ? "text-slate-400" : "text-slate-500"
          }`}
        >
          <Link to="/" className="hover:text-indigo-500 transition">Home</Link>
          <span>/</span>
          <Link to="/hotels" className="hover:text-indigo-500 transition">Hotels</Link>
          <span>/</span>
          <span className="text-indigo-500 font-bold">{hotel.name}</span>
        </div>

        {/* Hotel Header & Meta */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${
                  isNight
                    ? "border border-indigo-400/30 bg-indigo-600/30 text-indigo-300"
                    : "border border-indigo-200 bg-indigo-50 text-indigo-700"
                }`}
              >
                5-Star Luxury Resort
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isNight
                    ? "border border-white/15 bg-white/5 text-slate-300"
                    : "border border-slate-200 bg-slate-100 text-slate-700"
                }`}
              >
                📍 {hotel.city}
              </span>
            </div>

            <h1
              className={`font-heading mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              {hotel.name}
            </h1>

            <p
              className={`mt-2 text-sm font-medium flex items-center gap-2 ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <span>📌</span>
              <span>{hotel.address}</span>
            </p>
          </div>

          {/* Rating Pill */}
          <div
            className={`flex items-center gap-3 rounded-2xl p-4 shadow-xl backdrop-blur-md ${
              isNight
                ? "border border-white/10 bg-slate-900/80 text-white"
                : "border border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-xl font-black text-slate-950 shadow-md">
              ★
            </div>
            <div>
              <p className="font-heading text-xl font-bold">{rating} / 5.0</p>
              <p
                className={`text-xs ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Verified ({reviewsCount} reviews)
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic 3-Photo Gallery Collage */}
        <div
          className={`grid gap-4 md:grid-cols-3 h-[420px] rounded-3xl overflow-hidden shadow-2xl mb-12 ${
            isNight ? "border border-white/10" : "border border-slate-200"
          }`}
        >
          <div className="md:col-span-2 relative h-full group overflow-hidden bg-slate-800">
            <img
              src={galleryImages[0]}
              alt={hotel.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="relative flex-1 overflow-hidden group bg-slate-800">
              <img
                src={galleryImages[1]}
                alt="Hotel Suite"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="relative flex-1 overflow-hidden group bg-slate-800">
              <img
                src={galleryImages[2]}
                alt="Hotel Amenities"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Hotel Description & Amenities Row */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          <div
            className={`lg:col-span-2 rounded-3xl p-8 shadow-xl backdrop-blur-xl ${
              isNight
                ? "border border-white/10 bg-slate-900/70 text-white"
                : "border border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
            }`}
          >
            <h2 className="font-heading text-2xl font-bold mb-4">About this Sanctuary</h2>
            <p
              className={`leading-relaxed text-sm md:text-base ${
                isNight ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {hotel.description ||
                "Immerse yourself in world-class luxury, sophisticated dining, and peaceful tranquility designed for both leisure holidays and business executive retreats."}
            </p>

            <div
              className={`mt-8 border-t pt-6 ${
                isNight ? "border-white/10" : "border-slate-100"
              }`}
            >
              <h3 className="font-heading text-lg font-bold mb-4">Featured Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div
                  className={`flex items-center gap-2.5 rounded-xl p-3 ${
                    isNight ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>🏊</span> Infinity Pool
                </div>
                <div
                  className={`flex items-center gap-2.5 rounded-xl p-3 ${
                    isNight ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>💆</span> Spa & Wellness
                </div>
                <div
                  className={`flex items-center gap-2.5 rounded-xl p-3 ${
                    isNight ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>🍽️</span> Gourmet Dining
                </div>
                <div
                  className={`flex items-center gap-2.5 rounded-xl p-3 ${
                    isNight ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>📶</span> Fiber WiFi
                </div>
                <div
                  className={`flex items-center gap-2.5 rounded-xl p-3 ${
                    isNight ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>🚗</span> Valet Parking
                </div>
                <div
                  className={`flex items-center gap-2.5 rounded-xl p-3 ${
                    isNight ? "bg-white/5 text-slate-300" : "bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>🛎️</span> 24/7 Concierge
                </div>
              </div>
            </div>
          </div>

          {/* Quick Highlight Card */}
          <div
            className={`rounded-3xl p-8 shadow-xl flex flex-col justify-between ${
              isNight
                ? "border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/40 text-white"
                : "border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900"
            }`}
          >
            <div>
              <span className="text-3xl">🛡️</span>
              <h3 className="font-heading text-xl font-bold mt-3">StayEasy Guarantee</h3>
              <p
                className={`mt-2 text-xs leading-6 ${
                  isNight ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Best rate guarantee with 100% verified reservations, contactless check-in support, and flexible cancellations on selected suites.
              </p>
            </div>

            <div
              className={`mt-6 border-t pt-4 ${
                isNight ? "border-white/10" : "border-slate-200"
              }`}
            >
              <p className="text-xs text-indigo-500 font-semibold">
                ✓ Instant Online Booking
              </p>
              <p className="text-xs text-indigo-500 font-semibold mt-1">
                ✓ Free Cancellation Available
              </p>
            </div>
          </div>
        </div>

        {/* Available Rooms Section */}
        <section className="mt-12">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Accommodations</p>
            <h2
              className={`font-heading mt-2 text-3xl font-extrabold sm:text-4xl ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Available Rooms & Suites
            </h2>
            <p
              className={`mt-2 text-sm ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Select from our curated room categories tailored to your group size and comfort.
            </p>
          </div>

          {rooms.length === 0 ? (
            <div
              className={`rounded-3xl border border-dashed p-16 text-center ${
                isNight
                  ? "border-white/15 bg-slate-900/40 text-white"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            >
              <div className="text-5xl mb-3">🛏️</div>
              <h3 className="font-heading text-xl font-bold">No rooms currently listed</h3>
              <p
                className={`mt-1 text-sm ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                This hotel does not have active rooms available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  hotelId={hotel.id}
                />
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default HotelDetails;