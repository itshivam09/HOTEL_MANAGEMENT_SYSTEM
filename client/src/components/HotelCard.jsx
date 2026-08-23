import { Link } from "react-router-dom";

function HotelCard({ hotel }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40">
      
      {/* Hotel Image */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-900 to-slate-800">
        <div className="flex h-full items-center justify-center text-6xl transition duration-500 group-hover:scale-110">
          🏨
        </div>

        <div className="absolute left-4 top-4 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          Hotel
        </div>
      </div>

      {/* Content */}
      <div className="p-6">

        <h3 className="text-xl font-semibold text-white">
          {hotel.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <span>📍</span>
          <span>{hotel.city}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {hotel.description || "A comfortable place to stay."}
        </p>

        <p className="mt-3 text-sm text-slate-500">
          📌 {hotel.address}
        </p>

        <Link
          to={`/hotels/${hotel.id}`}
          className="mt-6 block rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          View Hotel
        </Link>

      </div>
    </div>
  );
}

export default HotelCard;