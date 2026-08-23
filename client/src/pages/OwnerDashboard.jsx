import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
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

  // ================================
  // GET HOTELS
  // ================================

  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/hotels/my");

      setHotels(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load hotels."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // ================================
  // FORM CHANGE
  // ================================

  const handleChange = (e) => {
    setHotelForm({
      ...hotelForm,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // ADD HOTEL
  // ================================

  const handleAddHotel = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await API.post(
        "/hotels/",
        hotelForm
      );

      // Add newly created hotel to UI
      setHotels((prevHotels) => [
        ...prevHotels,
        response.data,
      ]);

      // Reset form
      setHotelForm({
        name: "",
        city: "",
        address: "",
        description: "",
      });

      setShowAddHotel(false);

      setMessage("Hotel added successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to add hotel."
      );
    }
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ============================
          NAVBAR
      ============================= */}

      <nav className="border-b border-white/10 bg-slate-900">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold">
            🏨 HotelHub
          </h1>

          <div className="flex items-center gap-4">

            <span className="hidden text-sm text-slate-400 sm:block">
              Hotel Owner
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              Logout
            </button>

          </div>

        </div>

      </nav>


      {/* ============================
          MAIN
      ============================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm font-medium text-indigo-400">
              OWNER PANEL
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Owner Dashboard
            </h2>

            <p className="mt-2 text-slate-400">
              Manage your hotels from one place.
            </p>

          </div>


          {/* ADD HOTEL BUTTON */}

          <button
            onClick={() => {
              setShowAddHotel(true);
              setError("");
              setMessage("");
            }}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
          >
            + Add Hotel
          </button>

        </div>


        {/* ============================
            SUCCESS MESSAGE
        ============================= */}

        {message && (

          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-green-400">
            ✓ {message}
          </div>

        )}


        {/* ============================
            ERROR MESSAGE
        ============================= */}

        {error && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>

        )}


        {/* ============================
            STATISTICS
        ============================= */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <div className="text-3xl">
              🏨
            </div>

            <p className="mt-4 text-3xl font-bold">
              {hotels.length}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Total Hotels
            </p>

          </div>


          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <div className="text-3xl">
              🛏️
            </div>

            <p className="mt-4 text-3xl font-bold">
              —
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Total Rooms
            </p>

          </div>


          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

            <div className="text-3xl">
              📅
            </div>

            <p className="mt-4 text-3xl font-bold">
              —
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Total Bookings
            </p>

          </div>

        </div>


        {/* ============================
            ADD HOTEL FORM
        ============================= */}

        {showAddHotel && (

          <div className="mb-10 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold">
                  Add New Hotel
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Enter your hotel information.
                </p>

              </div>


              <button
                onClick={() => setShowAddHotel(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleAddHotel}
              className="grid gap-5 md:grid-cols-2"
            >

              {/* HOTEL NAME */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Hotel Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={hotelForm.name}
                  onChange={handleChange}
                  placeholder="Grand Hotel"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                />

              </div>


              {/* CITY */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={hotelForm.city}
                  onChange={handleChange}
                  placeholder="Kanpur"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                />

              </div>


              {/* ADDRESS */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={hotelForm.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Kanpur"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={hotelForm.description}
                  onChange={handleChange}
                  placeholder="Describe your hotel..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 md:col-span-2">

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
                >
                  Add Hotel
                </button>


                <button
                  type="button"
                  onClick={() => setShowAddHotel(false)}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}


        {/* ============================
            MY HOTELS
        ============================= */}

        <section>

          <div className="mb-6">

            <h3 className="text-2xl font-bold">
              My Hotels
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Hotels available in your account
            </p>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="py-20 text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

              <p className="mt-4 text-slate-400">
                Loading hotels...
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading && hotels.length === 0 && (

            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">

              <div className="text-6xl">
                🏨
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No hotels yet
              </h3>

              <p className="mt-2 text-slate-400">
                Add your first hotel to get started.
              </p>

              <button
                onClick={() => setShowAddHotel(true)}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
              >
                + Add Your First Hotel
              </button>

            </div>

          )}


          {/* HOTEL CARDS */}

          {!loading && hotels.length > 0 && (

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {hotels.map((hotel) => (

                <div
                  key={hotel.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-indigo-500/30"
                >

                  {/* IMAGE PLACEHOLDER */}

                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-600/30 via-purple-600/10 to-slate-900">

                    <span className="text-7xl">
                      🏨
                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="p-6">

                    <h4 className="text-xl font-bold">
                      {hotel.name}
                    </h4>

                    <p className="mt-2 text-indigo-400">
                      📍 {hotel.city}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      {hotel.address}
                    </p>


                    {hotel.description && (

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                        {hotel.description}
                      </p>

                    )}


                    {/* ACTIONS */}

                    <div className="mt-6 flex gap-3">

                      <button
                        onClick={() =>
                          navigate(
                            `/owner/hotels/${hotel.id}`
                          )
                        }
                        className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold transition hover:bg-indigo-500"
                      >
                        Manage Rooms
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/hotels/${hotel.id}`
                          )
                        }
                        className="rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:bg-white/5"
                      >
                        View
                      </button>

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

export default OwnerDashboard;