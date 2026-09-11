import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { getRoomImage } from "../utils/imageUtils";

function ManageHotel() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { isNight, toggleTheme } = useTheme();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [roomForm, setRoomForm] = useState({
    room_type: "",
    price_per_night: "",
    capacity: "2",
  });

  const [editingRoom, setEditingRoom] = useState(null);
  const [editRoomForm, setEditRoomForm] = useState({
    room_type: "",
    price_per_night: "",
    capacity: "2",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchHotelAndRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const [hotelRes, roomsRes] = await Promise.all([
        API.get(`/hotels/${hotelId}`).catch(() => ({ data: null })),
        API.get(`/rooms/${hotelId}`),
      ]);

      setHotel(hotelRes.data);
      setRooms(roomsRes.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelAndRooms();
  }, [hotelId]);

  const handleChange = (e) => {
    setRoomForm({
      ...roomForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditChange = (e) => {
    setEditRoomForm({
      ...editRoomForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setMessage("");

      const response = await API.post(`/rooms/${hotelId}`, {
        room_type: roomForm.room_type,
        price_per_night: Number(roomForm.price_per_night),
        capacity: Number(roomForm.capacity),
      });

      setRooms((prev) => [...prev, response.data]);
      setRoomForm({
        room_type: "",
        price_per_night: "",
        capacity: "2",
      });
      setShowAddRoom(false);
      setMessage("🎉 Room added successfully to your hotel inventory!");
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to add room.");
    }
  };

  const startEditRoom = (room) => {
    setEditingRoom(room);
    setEditRoomForm({
      room_type: room.room_type,
      price_per_night: room.price_per_night,
      capacity: room.capacity,
    });
    setError("");
    setMessage("");
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      setError("");
      setMessage("");

      const response = await API.put(`/rooms/${editingRoom.id}`, {
        room_type: editRoomForm.room_type,
        price_per_night: Number(editRoomForm.price_per_night),
        capacity: Number(editRoomForm.capacity),
      });

      setRooms((prev) =>
        prev.map((r) => (r.id === editingRoom.id ? response.data : r))
      );
      setEditingRoom(null);
      setMessage("✓ Room details updated successfully!");
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to update room.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      setError("");
      await API.delete(`/rooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      setMessage("Room removed from inventory.");
      setTimeout(() => setMessage(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Unable to delete room.");
    }
  };

  return (
    <div
      className={`min-h-screen pb-24 transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`border-b backdrop-blur-xl sticky top-0 z-40 transition-colors duration-500 ${
          isNight
            ? "border-white/10 bg-slate-950/80 text-white"
            : "border-slate-200 bg-white/85 text-slate-900 shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/owner" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-lg shadow-lg">
              🏨
            </div>
            <div>
              <span className="font-heading text-lg font-bold">StayEasy</span>
              <span className="text-xs text-indigo-500 block font-semibold">Room Inventory</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
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

            <button
              onClick={() => navigate("/owner")}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition cursor-pointer ${
                isNight
                  ? "border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        {/* Hotel Header Banner */}
        <div
          className={`mb-10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
            isNight
              ? "border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 text-white"
              : "border border-slate-200 bg-gradient-to-r from-white via-indigo-50/50 to-white text-slate-900 shadow-slate-200/50"
          }`}
        >
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold mb-3 ${
                isNight
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              📍 {hotel?.city || "Property Location"} • Hotel ID #{hotelId}
            </span>
            <h1 className="font-heading text-3xl font-extrabold sm:text-4xl">
              {hotel?.name || "Manage Hotel Rooms"}
            </h1>
            <p
              className={`text-xs mt-1 ${
                isNight ? "text-slate-400" : "text-slate-500"
              }`}
            >
              📌 {hotel?.address || "Address unavailable"}
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddRoom(true);
              setEditingRoom(null);
              setError("");
              setMessage("");
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-heading font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-105 cursor-pointer"
          >
            + Add New Room
          </button>
        </div>

        {/* Alerts */}
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

        {/* Add Room Panel */}
        {showAddRoom && (
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
                <h3 className="font-heading text-2xl font-bold">Add New Room Category</h3>
                <p
                  className={`text-xs mt-1 ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Define room type, nightly rate, and maximum guest capacity.
                </p>
              </div>
              <button
                onClick={() => setShowAddRoom(false)}
                className={`text-2xl cursor-pointer ${
                  isNight ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="grid gap-6 md:grid-cols-3">
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Room Type / Category
                </label>
                <input
                  type="text"
                  name="room_type"
                  value={roomForm.room_type}
                  onChange={handleChange}
                  placeholder="e.g. Deluxe Ocean Suite"
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
                  Price Per Night (₹)
                </label>
                <input
                  type="number"
                  name="price_per_night"
                  value={roomForm.price_per_night}
                  onChange={handleChange}
                  placeholder="e.g. 4500"
                  min="0"
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
                  Capacity (Guests)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={roomForm.capacity}
                  onChange={handleChange}
                  placeholder="2"
                  min="1"
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex gap-4 md:col-span-3">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-heading font-bold text-white shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Save & Publish Room
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className={`rounded-xl border px-6 py-3.5 font-semibold cursor-pointer ${
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

        {/* Edit Room Modal */}
        {editingRoom && (
          <div
            className={`mb-12 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl transition-all ${
              isNight
                ? "border border-indigo-500/50 bg-slate-900/95 text-white"
                : "border border-indigo-300 bg-white text-slate-900 shadow-slate-200/80"
            }`}
          >
            <div
              className={`flex items-center justify-between mb-6 pb-4 border-b ${
                isNight ? "border-white/10" : "border-slate-100"
              }`}
            >
              <div>
                <h3 className="font-heading text-2xl font-bold">Edit Room #{editingRoom.id}</h3>
                <p
                  className={`text-xs mt-1 ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Update room category information, pricing, or capacity.
                </p>
              </div>
              <button
                onClick={() => setEditingRoom(null)}
                className={`text-2xl cursor-pointer ${
                  isNight ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateRoom} className="grid gap-6 md:grid-cols-3">
              <div>
                <label
                  className={`mb-2 block text-xs font-bold uppercase tracking-wider ${
                    isNight ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Room Type
                </label>
                <input
                  type="text"
                  name="room_type"
                  value={editRoomForm.room_type}
                  onChange={handleEditChange}
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
                  Price Per Night (₹)
                </label>
                <input
                  type="number"
                  name="price_per_night"
                  value={editRoomForm.price_per_night}
                  onChange={handleEditChange}
                  min="0"
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
                  Capacity (Guests)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={editRoomForm.capacity}
                  onChange={handleEditChange}
                  min="1"
                  required
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-semibold outline-none focus:border-indigo-500 ${
                    isNight
                      ? "border-white/10 bg-slate-950 text-white"
                      : "border-slate-300 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex gap-4 md:col-span-3">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 font-heading font-bold text-white shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className={`rounded-xl border px-6 py-3.5 font-semibold cursor-pointer ${
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

        {/* Rooms Listing */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2
                className={`font-heading text-2xl font-bold ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Active Room Inventory
              </h2>
              <p
                className={`text-xs mt-1 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                All rooms and suites configured for this hotel.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                isNight
                  ? "bg-white/5 border border-white/10 text-slate-300"
                  : "bg-slate-100 border border-slate-200 text-slate-700"
              }`}
            >
              {rooms.length} Room Category{rooms.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
            </div>
          ) : rooms.length === 0 ? (
            <div
              className={`rounded-3xl border border-dashed p-16 text-center ${
                isNight
                  ? "border-white/15 bg-slate-900/40 text-white"
                  : "border-slate-300 bg-white text-slate-900"
              }`}
            >
              <div className="text-6xl mb-3">🛏️</div>
              <h3 className="font-heading text-xl font-bold">No rooms added yet</h3>
              <p
                className={`text-xs mt-1 ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Add room categories so travelers can book suites at your hotel.
              </p>
              <button
                onClick={() => setShowAddRoom(true)}
                className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-500"
              >
                + Add First Room
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => {
                const roomImage = getRoomImage(room, Number(hotelId));
                return (
                  <div
                    key={room.id}
                    className={`overflow-hidden rounded-3xl shadow-xl transition hover:border-indigo-500/40 ${
                      isNight
                        ? "border border-white/10 bg-slate-900/80 text-white"
                        : "border border-slate-200 bg-white text-slate-900 shadow-slate-200/50"
                    }`}
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                      <img
                        src={roomImage}
                        alt={room.room_type}
                        className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-emerald-400 backdrop-blur-md">
                        ● Available
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-heading text-xl font-bold">{room.room_type}</h3>
                      <p className="mt-2 text-2xl font-extrabold text-indigo-500 font-heading">
                        ₹{room.price_per_night}{" "}
                        <span
                          className={`text-xs font-normal ${
                            isNight ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          / night
                        </span>
                      </p>
                      <p
                        className={`mt-2 text-xs ${
                          isNight ? "text-slate-400" : "text-slate-500"
                        }`}
                      >
                        👥 Capacity: {room.capacity} Guests
                      </p>

                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => startEditRoom(room)}
                          className={`flex-1 rounded-xl border py-2.5 text-xs font-bold transition cursor-pointer ${
                            isNight
                              ? "border-white/10 text-slate-200 hover:bg-white/10"
                              : "border-slate-300 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ManageHotel;