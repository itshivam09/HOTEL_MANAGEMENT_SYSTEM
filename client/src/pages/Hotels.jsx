import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";
import API from "../services/api";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHotels = async (searchCity = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/hotels/", {
        params: searchCity ? { city: searchCity } : {},
      });

      setHotels(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load hotels. Is your FastAPI server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels(city);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
            Explore
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Find your perfect hotel
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Browse our hotels and find a comfortable place for your next stay.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="mb-12 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:flex-row"
        >
          <div className="flex flex-1 items-center rounded-xl bg-slate-900 px-4">
            <span className="mr-3">📍</span>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city..."
              className="w-full bg-transparent py-4 text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-8 py-4 font-semibold transition hover:bg-indigo-500"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => {
              setCity("");
              fetchHotels();
            }}
            className="rounded-xl border border-white/10 px-6 py-4 font-medium text-slate-300 transition hover:bg-white/5"
          >
            All Hotels
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && hotels.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <div className="text-5xl">🏨</div>

            <h2 className="mt-4 text-2xl font-semibold">
              No hotels found
            </h2>

            <p className="mt-2 text-slate-500">
              Try searching for another city.
            </p>
          </div>
        )}

        {/* Hotels */}
        {!loading && !error && hotels.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-400">
                <span className="font-semibold text-white">
                  {hotels.length}
                </span>{" "}
                hotels found
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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