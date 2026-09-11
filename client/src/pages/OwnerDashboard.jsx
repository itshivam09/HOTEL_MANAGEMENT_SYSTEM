import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getHotelImage } from "../utils/imageUtils";

function OwnerDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { isNight, toggleTheme } = useTheme();

  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showAddHotel, setShowAddHotel] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [hotelsRes, bookingsRes] = await Promise.all([
        API.get("/hotels/my"),
        API.get("/bookings/owner").catch(() => ({ data: [] })),
      ]);

      const ownerHotels = hotelsRes.data || [];
      setHotels(ownerHotels);
      setBookings(bookingsRes.data || []);

      let roomsCount = 0;
      await Promise.all(
        ownerHotels.map(async (h) => {
          try {
            const rRes = await API.get(`/rooms/${h.id}`);
            roomsCount += (rRes.data || []).length;
          } catch (e) {
            console.error("Failed to load rooms for hotel", h.id, e);
          }
        })
      );
      setTotalRooms(roomsCount);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to load owner dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleChange = (e) => {
    setHotelForm({
      ...hotelForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");

      const response = await API.post("/hotels/", hotelForm);
      setHotels((prev) => [...prev, response.data]);
      setHotelForm({
        name: "",
        city: "",
        address: "",
        description: "",
      });
      setShowAddHotel(false);
      setMessage("🎉 Hotel registered successfully!");
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to add hotel.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalRevenue = bookings.reduce((sum, b) => (b.status !== "cancelled" ? sum + (b.total_price || 0) : sum), 0);

  const filteredBookings = bookings.filter((b) =>
    (b.customer_name || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
    (b.hotel_name || "").toLowerCase().includes(searchFilter.toLowerCase()) ||
    (b.room_type || "").toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Executive Navbar */}
      <nav
        className={`border-b backdrop-blur-xl sticky top-0 z-40 transition-colors duration-500 ${
          isNight
            ? "border-white/10 bg-slate-950/80 text-white"
            : "border-slate-200 bg-white/85 text-slate-900 shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-lg shadow-lg">
              👑
            </div>
            <div>
              <span className="font-heading text-lg font-bold">StayEasy</span>
              <span className="text-xs text-indigo-500 block font-semibold">Owner Portal</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Day / Night Switcher */}
            <button
              onClick={toggleTheme}
              title={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                isNight
                  ? "border border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                  : "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <span>{isNight ? "🌙" : "☀️"}</span>
              <span className="hidden sm:inline">{isNight ? "Night" : "Day"}</span>
            </button>

            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold">{user?.name || "Hotel Owner"}</p>
              <p className="text-[10px] text-indigo-500">Verified Partner</p>
            </div>

            <button
              onClick={handleLogout}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
                isNight
                  ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white"
                  : "border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
              }`}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        {/* Header Title & CTA */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                isNight
                  ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                  : "border border-indigo-200 bg-indigo-50 text-indigo-700"
              }`}
            >
              <span>⚡</span>
              <span>EXECUTIVE CONTROL CENTER</span>
            </div>
            <h1
              className={`font-heading mt-3 text-3xl font-extrabold sm:text-4xl ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Owner Dashboard
            </h1>
            <p
              className={`mt-1 text-sm ${
                isNight ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Manage your hotel portfolio, rooms inventory, and live guest reservations.
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddHotel(true);
              setError("");
              setMessage("");
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-heading font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 cursor-pointer"
          >
            <span>+ Add New Hotel</span>
          </button>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className="mb-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-500 backdrop-blur-xl">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-400 backdrop-blur-xl">
            {error}
          </div>
        )}

        {/* Metrics Cards */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon="🏨"
            title="Total Hotels"
            value={hotels.length}
            tag="Active Properties"
            color="from-indigo-600 to-blue-600"
            isNight={isNight}
          />

          <MetricCard
            icon="🛏️"
            title="Total Rooms"
            value={totalRooms}
            tag="Listed Suites"
            color="from-purple-600 to-indigo-600"
            isNight={isNight}
          />

          <MetricCard
            icon="📅"
            title="Guest Bookings"
            value={bookings.length}
            tag="All Time Reservations"
            color="from-pink-600 to-purple-600"
            isNight={isNight}
          />

          <MetricCard
            icon="💰"
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            tag="Gross Bookings Value"
            color="from-emerald-600 to-teal-600"
            isNight={isNight}
          />
        </div>

        {/* Add Hotel Modal / Form */}
        {showAddHotel && (
          <div
            className={`mb-12 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl transition-all ${
              isNight
                ? "border border-indigo-500/30 bg-slate-900/95 text-white"
                : "border border-indigo-200 bg-white text-slate-900 shadow-slate-200/80"
            }`}
          >
            <div
              className={`flex items-center justify-between mb-6 pb-4 border-b ${
                isNight ? "border-white/10" : "border-slate-100"
              }`}
            >
              <div>
                <h3 className="font-heading text-2xl font-bold">Register New Property</h3>
                <p
                  className={`text-xs mt-1 ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Provide your hotel's details to begin accepting reservations.
                </p>
              </div>
              <button
                onClick={() => setShowAddHotel(false)}
                className={`text-2xl cursor-pointer ${
                  isNight ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddHotel} className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Hotel Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={hotelForm.name}
                  onChange={handleChange}
                  placeholder="e.g. Grand Royale Palace"
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={hotelForm.city}
                  onChange={handleChange}
                  placeholder="e.g. Goa, Mumbai, Kanpur..."
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Full Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={hotelForm.address}
                  onChange={handleChange}
                  placeholder="e.g. 100 Marine Drive, Nariman Point, Mumbai"
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Hotel Description & Highlights
                </label>
                <textarea
                  name="description"
                  value={hotelForm.description}
                  onChange={handleChange}
                  placeholder="Describe your property amenities, scenic views, and hospitality..."
                  rows="3"
                  className={`w-full resize-none rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex gap-4 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-heading font-bold text-white shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Create Hotel Profile
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddHotel(false)}
                  className={`rounded-xl border px-6 py-3.5 font-semibold transition cursor-pointer ${
                    isNight
                      ? "border-white/10 text-slate-300 hover:bg-white/5"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Managed Properties Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2
                className={`font-heading text-2xl font-bold ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Your Managed Properties
              </h2>
              <p
                className={`text-xs mt-1 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Select a hotel to manage rooms, prices, or inventory.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isNight
                  ? "bg-white/5 border border-white/10 text-slate-300"
                  : "bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              {hotels.length} Hotel{hotels.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
            </div>
          ) : hotels.length === 0 ? (
            <div
              className={`rounded-3xl border border-dashed p-16 text-center ${
                isNight
                  ? "border-white/15 bg-slate-900/40 text-white"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            >
              <div className="text-6xl mb-3">🏨</div>
              <h3 className="font-heading text-xl font-bold">No properties registered yet</h3>
              <p
                className={`mt-1 text-sm ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Add your first hotel property to start managing rooms and taking bookings.
              </p>
              <button
                onClick={() => setShowAddHotel(true)}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500"
              >
                + Register First Hotel
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className={`group overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${
                    isNight
                      ? "border border-white/10 bg-slate-900/80 hover:border-indigo-500/40 text-white"
                      : "border border-slate-200 bg-white hover:border-indigo-300 text-slate-900 shadow-slate-200/50"
                  }`}
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <img
                      src={getHotelImage(hotel)}
                      alt={hotel.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-4 left-4 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                      📍 {hotel.city}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold">{hotel.name}</h3>
                    <p
                      className={`mt-1 text-xs line-clamp-1 ${
                        isNight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      📌 {hotel.address}
                    </p>
                    <p
                      className={`mt-3 text-xs leading-5 line-clamp-2 ${
                        isNight ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {hotel.description || "Luxury property under your management."}
                    </p>

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => navigate(`/owner/hotels/${hotel.id}`)}
                        className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 text-xs font-bold text-white shadow transition hover:from-indigo-500 hover:to-indigo-600 cursor-pointer"
                      >
                        🛏️ Manage Rooms
                      </button>
                      <button
                        onClick={() => navigate(`/hotels/${hotel.id}`)}
                        className={`rounded-xl border px-4 py-2.5 text-xs font-semibold cursor-pointer ${
                          isNight
                            ? "border-white/10 text-slate-300 hover:bg-white/5"
                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        View Page
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Live Guest Reservations Table */}
        <section>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2
                className={`font-heading text-2xl font-bold ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Live Customer Bookings
              </h2>
              <p
                className={`text-xs mt-1 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Real-time guest reservations for all your hotels.
              </p>
            </div>

            {/* Search filter */}
            <div className="w-full sm:w-72">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by guest, hotel, or room..."
                className={`w-full rounded-xl border px-4 py-2.5 text-xs outline-none focus:border-indigo-500 ${
                  isNight
                    ? "border-white/10 bg-slate-900 text-white"
                    : "border-slate-300 bg-white text-slate-900 shadow-sm"
                }`}
              />
            </div>
          </div>

          {bookings.length === 0 ? (
            <div
              className={`rounded-3xl border border-dashed p-14 text-center ${
                isNight
                  ? "border-white/15 bg-slate-900/40 text-white"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            >
              <div className="text-5xl mb-3">📅</div>
              <h4 className="font-heading text-lg font-bold">No guest bookings yet</h4>
              <p
                className={`text-xs mt-1 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                When travelers book rooms at your hotels, they will appear here live.
              </p>
            </div>
          ) : (
            <div
              className={`overflow-x-auto rounded-3xl shadow-2xl backdrop-blur-xl ${
                isNight
                  ? "border border-white/10 bg-slate-900/80 text-slate-300"
                  : "border border-slate-200 bg-white text-slate-700 shadow-slate-200/60"
              }`}
            >
              <table className="w-full text-left text-sm">
                <thead
                  className={`border-b text-[11px] uppercase font-bold tracking-wider ${
                    isNight
                      ? "border-white/10 bg-white/5 text-slate-400"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}
                >
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Hotel</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-xs ${
                    isNight ? "divide-white/5" : "divide-slate-100"
                  }`}
                >
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className={`transition ${
                        isNight ? "hover:bg-white/[0.02]" : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-indigo-500">#{b.id}</td>
                      <td className="px-6 py-4">
                        <p
                          className={`font-bold ${
                            isNight ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {b.customer_name}
                        </p>
                        <p
                          className={`text-[11px] ${
                            isNight ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {b.customer_email}
                        </p>
                      </td>
                      <td
                        className={`px-6 py-4 font-semibold ${
                          isNight ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {b.hotel_name}
                      </td>
                      <td className="px-6 py-4">{b.room_type}</td>
                      <td className="px-6 py-4">
                        <p>In: {new Date(b.check_in).toLocaleDateString("en-IN")}</p>
                        <p className={isNight ? "text-slate-400" : "text-slate-500"}>
                          Out: {new Date(b.check_out).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-500">₹{b.total_price}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            b.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : b.status === "cancelled"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function MetricCard({ icon, title, value, tag, color, isNight }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl transition-all ${
        isNight
          ? "border border-white/10 bg-slate-900/80 text-white"
          : "border border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl">{icon}</span>
        <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${color}`} />
      </div>
      <p className="font-heading mt-4 text-3xl font-extrabold">{value}</p>
      <p
        className={`text-xs font-bold uppercase tracking-wider mt-1 ${
          isNight ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {title}
      </p>
      <p className="text-[11px] text-indigo-500 mt-2 font-medium">{tag}</p>
    </div>
  );
}

export default OwnerDashboard;