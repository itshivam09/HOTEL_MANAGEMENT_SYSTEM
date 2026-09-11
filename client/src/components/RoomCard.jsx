import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getRoomImage } from "../utils/imageUtils";

function RoomCard({ room, hotelId }) {
  const { user } = useAuth();
  const { isNight } = useTheme();
  const roomImage = getRoomImage(room, hotelId);

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-3xl transition-all duration-300 shadow-xl ${
        isNight
          ? "border border-white/10 bg-slate-900/85 hover:border-indigo-500/40 text-white"
          : "border border-slate-200/90 bg-white hover:border-indigo-400 text-slate-900"
      }`}
    >
      {/* Room Image with Availability Tag */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-800">
        <img
          src={roomImage}
          alt={room.room_type}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70" />

        {/* Availability Badge */}
        <div className="absolute left-4 top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${
              room.is_available
                ? "border border-emerald-500/30 bg-emerald-950/75 text-emerald-300"
                : "border border-red-500/30 bg-red-950/75 text-red-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                room.is_available ? "bg-emerald-400 animate-pulse" : "bg-red-400"
              }`}
            />
            {room.is_available ? "Available for Booking" : "Sold Out"}
          </span>
        </div>

        {/* Capacity Pill */}
        <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          👥 Up to {room.capacity} Guests
        </div>
      </div>

      {/* Room Information */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3
            className={`font-heading text-2xl font-bold tracking-tight ${
              isNight ? "text-white" : "text-slate-900"
            }`}
          >
            {room.room_type}
          </h3>

          <p
            className={`mt-2 text-xs ${
              isNight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Spacious air-conditioned room with modern en-suite bath, high-speed WiFi, and premium linen.
          </p>

          {/* Included Amenities */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div
              className={`flex items-center gap-2 rounded-lg p-2 ${
                isNight ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              <span>📶</span> Free Ultra-Fast WiFi
            </div>
            <div
              className={`flex items-center gap-2 rounded-lg p-2 ${
                isNight ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              <span>❄️</span> Climate Control AC
            </div>
            <div
              className={`flex items-center gap-2 rounded-lg p-2 ${
                isNight ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              <span>🍳</span> Breakfast Option
            </div>
            <div
              className={`flex items-center gap-2 rounded-lg p-2 ${
                isNight ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-700"
              }`}
            >
              <span>🛡️</span> Free Cancellation
            </div>
          </div>
        </div>

        {/* Price & Action Section */}
        <div
          className={`mt-6 border-t pt-5 ${
            isNight ? "border-white/10" : "border-slate-100"
          }`}
        >
          <div className="flex items-end justify-between">
            <div>
              <p
                className={`text-xs uppercase tracking-wider ${
                  isNight ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Price per night
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-3xl font-extrabold text-indigo-500">
                  ₹{room.price_per_night}
                </span>
                <span
                  className={`text-xs ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  + taxes
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              {room.is_available && user?.role === "user" ? (
                <Link
                  to={`/my-bookings?roomId=${room.id}&hotelId=${hotelId}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-105 hover:from-indigo-500 hover:to-purple-500"
                >
                  <span>Book Now</span>
                  <span>→</span>
                </Link>
              ) : room.is_available && !user ? (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-500"
                >
                  Login to Book
                </Link>
              ) : (
                <button
                  disabled
                  className={`cursor-not-allowed rounded-xl px-5 py-3 text-sm font-semibold ${
                    isNight ? "bg-slate-800 text-slate-500" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  Unavailable
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default RoomCard;