import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ManageHotel() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddRoom, setShowAddRoom] = useState(false);

  const [roomForm, setRoomForm] = useState({
    room_type: "",
    price_per_night: "",
    capacity: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =========================
  // GET ROOMS
  // =========================

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/rooms/${hotelId}`);

      setRooms(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to load rooms."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    setRoomForm({
      ...roomForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD ROOM
  // =========================

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const response = await API.post(
        `/rooms/${hotelId}`,
        {
          room_type: roomForm.room_type,
          price_per_night: Number(
            roomForm.price_per_night
          ),
          capacity: Number(roomForm.capacity),
        }
      );

      setRooms((prev) => [
        ...prev,
        response.data,
      ]);

      setRoomForm({
        room_type: "",
        price_per_night: "",
        capacity: "",
      });

      setShowAddRoom(false);

      setMessage("Room added successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to add room."
      );
    }
  };

  // =========================
  // DELETE ROOM
  // =========================

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await API.delete(`/rooms/${roomId}`);

      setRooms((prev) =>
        prev.filter((room) => room.id !== roomId)
      );

      setMessage("Room deleted successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Unable to delete room."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}

      <nav className="border-b border-white/10 bg-slate-900">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold">
            🏨 HotelHub
          </h1>

          <button
            onClick={() => navigate("/owner")}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            Dashboard
          </button>

        </div>

      </nav>


      {/* MAIN */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* BACK */}

        <button
          onClick={() => navigate("/owner")}
          className="mb-6 text-indigo-400 hover:text-indigo-300"
        >
          ← Back to Dashboard
        </button>


        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <p className="text-sm font-medium text-indigo-400">
              HOTEL MANAGEMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Manage Rooms
            </h1>

            <p className="mt-2 text-slate-400">
              Hotel ID: {hotelId}
            </p>

          </div>


          <button
            onClick={() => {
              setShowAddRoom(true);
              setError("");
            }}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
          >
            + Add Room
          </button>

        </div>


        {/* SUCCESS */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-green-400">
            ✓ {message}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>
        )}


        {/* ADD ROOM FORM */}

        {showAddRoom && (

          <div className="mb-10 rounded-2xl border border-white/10 bg-slate-900 p-6">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Add New Room
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Enter room details.
                </p>
              </div>

              <button
                onClick={() => setShowAddRoom(false)}
                className="text-2xl text-slate-400 hover:text-white"
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleAddRoom}
              className="grid gap-5 md:grid-cols-3"
            >

              {/* ROOM TYPE */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Room Type
                </label>

                <input
                  type="text"
                  name="room_type"
                  value={roomForm.room_type}
                  onChange={handleChange}
                  placeholder="Deluxe Room"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* PRICE */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Price Per Night
                </label>

                <input
                  type="number"
                  name="price_per_night"
                  value={roomForm.price_per_night}
                  onChange={handleChange}
                  placeholder="2500"
                  min="0"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* CAPACITY */}

              <div>

                <label className="mb-2 block text-sm text-slate-300">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={roomForm.capacity}
                  onChange={handleChange}
                  placeholder="2"
                  min="1"
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex gap-3 md:col-span-3">

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
                >
                  Add Room
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="rounded-xl border border-white/10 px-6 py-3 font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}


        {/* ROOMS */}

        <section>

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Rooms
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {rooms.length} room
                {rooms.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="py-20 text-center">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

              <p className="mt-4 text-slate-400">
                Loading rooms...
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading && rooms.length === 0 && (

            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">

              <div className="text-6xl">
                🛏️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No rooms yet
              </h3>

              <p className="mt-2 text-slate-400">
                Add your first room to this hotel.
              </p>

            </div>

          )}


          {/* ROOM CARDS */}

          {!loading && rooms.length > 0 && (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {rooms.map((room) => (

                <div
                  key={room.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >

                  <div className="flex items-start justify-between">

                    <div className="text-4xl">
                      🛏️
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        room.is_available
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {room.is_available
                        ? "Available"
                        : "Unavailable"}
                    </span>

                  </div>


                  <h3 className="mt-5 text-xl font-bold">
                    {room.room_type}
                  </h3>


                  <p className="mt-3 text-2xl font-bold text-indigo-400">
                    ₹{room.price_per_night}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      / night
                    </span>
                  </p>


                  <div className="mt-4 text-sm text-slate-400">
                    👥 Capacity:{" "}
                    <span className="text-white">
                      {room.capacity}
                    </span>
                  </div>


                  <div className="mt-6 flex gap-3">

                    <button
                      className="flex-1 rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteRoom(room.id)
                      }
                      className="flex-1 rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      Delete
                    </button>

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

export default ManageHotel;