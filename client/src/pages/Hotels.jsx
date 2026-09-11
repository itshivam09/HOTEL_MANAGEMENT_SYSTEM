import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Hotels() {
  const { isNight } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || "";

  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState(initialCity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quickFilters = ["All", "Goa", "Mumbai", "Delhi", "Kanpur", "Jaipur", "Bangalore"];

  const fetchHotels = async (searchCity = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/hotels/", {
        params: searchCity ? { city: searchCity } : {},
      });

      setHotels(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load hotels. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(initialCity);
    setCity(initialCity);
  }, [initialCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchParams({ city: city.trim() });
    } else {
      setSearchParams({});
    }
    fetchHotels(city.trim());
  };

  const handleFilterClick = (filterCity) => {
    if (filterCity === "All") {
      setCity("");
      setSearchParams({});
      fetchHotels("");
    } else {
      setCity(filterCity);
      setSearchParams({ city: filterCity });
      fetchHotels(filterCity);
    }
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 max-w-3xl">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold backdrop-blur-md ${
              isNight
                ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
                : "border border-indigo-200 bg-indigo-50 text-indigo-700"
            }`}
          >
            <span>✨</span>
            <span>HANDPICKED LUXURY PORTFOLIO</span>
          </div>

          <h1
            className={`font-heading mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl ${
              isNight ? "text-white" : "text-slate-900"
            }`}
          >
            Find Your Dream Stay
          </h1>

          <p
            className={`mt-3 text-base ${
              isNight ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Browse our verified luxury properties across India with transparent pricing and top-tier amenities.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          className={`mb-12 rounded-3xl p-5 shadow-2xl backdrop-blur-xl transition-all ${
            isNight
              ? "border border-white/10 bg-slate-900/80 shadow-black/40"
              : "border border-slate-200 bg-white/90 shadow-slate-200/60"
          }`}
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div
              className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3.5 border transition focus-within:border-indigo-500 ${
                isNight
                  ? "bg-white/5 border-white/5 text-white"
                  : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            >
              <span className="text-xl">📍</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search by city (e.g. Goa, Mumbai, Kanpur)..."
                className={`w-full bg-transparent text-sm font-semibold outline-none ${
                  isNight
                    ? "text-white placeholder:text-slate-500"
                    : "text-slate-900 placeholder:text-slate-400"
                }`}
              />
              {city && (
                <button
                  type="button"
                  onClick={() => {
                    setCity("");
                    setSearchParams({});
                    fetchHotels("");
                  }}
                  className={`text-xs ${
                    isNight ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  ✕ Clear
                </button>
              )}
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-heading font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div
            className={`mt-4 flex flex-wrap items-center gap-2 pt-3 border-t ${
              isNight ? "border-white/5" : "border-slate-100"
            }`}
          >
            <span
              className={`text-xs font-semibold mr-1 ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Filter by City:
            </span>
            {quickFilters.map((q) => {
              const isSelected = q === "All" ? !city : city.toLowerCase() === q.toLowerCase();
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleFilterClick(q)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : isNight
                      ? "border border-white/10 bg-white/5 text-slate-300 hover:border-indigo-500/40 hover:text-white"
                      : "border border-slate-200 bg-slate-100 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {q}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`animate-pulse rounded-3xl p-4 h-[420px] ${
                  isNight
                    ? "border border-white/10 bg-slate-900/60"
                    : "border border-slate-200 bg-white"
                }`}
              >
                <div
                  className={`h-56 rounded-2xl ${
                    isNight ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />
                <div
                  className={`mt-6 h-6 w-3/4 rounded-lg ${
                    isNight ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />
                <div
                  className={`mt-3 h-4 w-1/2 rounded ${
                    isNight ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />
                <div
                  className={`mt-6 h-10 rounded-xl ${
                    isNight ? "bg-slate-800" : "bg-slate-100"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-400">
            <p className="text-3xl mb-2">⚠️</p>
            <p className="font-semibold text-lg">{error}</p>
            <button
              onClick={() => fetchHotels(city)}
              className="mt-4 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-500 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && hotels.length === 0 && (
          <div
            className={`rounded-3xl p-16 text-center shadow-xl ${
              isNight
                ? "border border-white/10 bg-slate-900/60 text-white"
                : "border border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="text-6xl mb-4">🏨</div>
            <h2 className="font-heading text-2xl font-bold">No hotels found</h2>
            <p
              className={`mt-2 text-sm max-w-md mx-auto ${
                isNight ? "text-slate-400" : "text-slate-600"
              }`}
            >
              We couldn't find any hotels matching "{city}". Try searching for another city or explore all properties.
            </p>
            <button
              onClick={() => handleFilterClick("All")}
              className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-500"
            >
              Show All Hotels
            </button>
          </div>
        )}

        {/* Hotel Grid */}
        {!loading && !error && hotels.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p
                className={`text-sm font-semibold ${
                  isNight ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Showing{" "}
                <span
                  className={`font-bold ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  {hotels.length}
                </span>{" "}
                luxury properties
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default Hotels;