import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoomCard({ room, hotelId }) {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 transition hover:border-indigo-500/40">

      <div className="flex items-start justify-between">

        <div>
          <div className="mb-4 text-4xl">🛏️</div>

          <h3 className="text-xl font-semibold text-white">
            {room.room_type}
          </h3>

          <p className="mt-2 text-slate-400">
            👥 Capacity: {room.capacity} guests
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            room.is_available
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {room.is_available ? "Available" : "Unavailable"}
        </span>

      </div>

      <div className="my-6 border-t border-white/10" />

      <div className="flex items-center justify-between">

        <div>
          <p className="text-2xl font-bold text-white">
            ₹{room.price_per_night}
          </p>

          <p className="text-sm text-slate-500">
            per night
          </p>
        </div>

        {/* BOOK BUTTON */}

        {room.is_available && user?.role === "user" ? (
          <Link
            to={`/my-bookings?roomId=${room.id}&hotelId=${hotelId}`}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            🛏️ Book Now
          </Link>
        ) : room.is_available && !user ? (
          <Link
            to="/login"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            Login to Book
          </Link>
        ) : (
          <button
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-700 px-5 py-3 text-slate-400"
          >
            Unavailable
          </button>
        )}

      </div>

    </div>
  );
}

export default RoomCard;