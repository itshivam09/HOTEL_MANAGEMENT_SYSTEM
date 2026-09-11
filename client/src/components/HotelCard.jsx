import { Link } from "react-router-dom";
import { getHotelImage, getHotelRating } from "../utils/imageUtils";
import { useTheme } from "../context/ThemeContext";

function HotelCard({ hotel }) {
  const { isNight } = useTheme();
  const imageUrl = getHotelImage(hotel);
  const { rating, reviewsCount } = getHotelRating(hotel.id);

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
        isNight
          ? "border border-white/10 bg-slate-900/85 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 text-white"
          : "border border-slate-200/90 bg-white hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100 text-slate-900"
      }`}
    >
      {/* Hotel Thumbnail with Gradient Overlays */}
      <div className="relative h-64 w-full overflow-hidden bg-slate-800">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/20 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            📍 {hotel.city}
          </span>
          <span className="rounded-full border border-indigo-400/30 bg-indigo-600/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
            Verified Stay
          </span>
        </div>

        {/* Star Rating Badge */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-slate-950/80 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md shadow-lg">
          <span>★</span>
          <span>{rating}</span>
          <span className="text-[10px] font-normal text-slate-400">({reviewsCount})</span>
        </div>
      </div>

      {/* Hotel Details Content */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between">
            <h3
              className={`font-heading text-xl font-bold tracking-tight transition-colors group-hover:text-indigo-500 ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              {hotel.name}
            </h3>
          </div>

          <p
            className={`mt-2 text-xs font-medium line-clamp-1 ${
              isNight ? "text-slate-400" : "text-slate-500"
            }`}
          >
            📌 {hotel.address}
          </p>

          <p
            className={`mt-3 text-sm leading-6 line-clamp-2 ${
              isNight ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {hotel.description ||
              "Experience top-tier luxury, curated amenities, and scenic comfort for your holiday or business trip."}
          </p>

          {/* Luxury Amenity Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium">
            <span
              className={`rounded-lg px-2.5 py-1 ${
                isNight
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              🏊 Pool
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 ${
                isNight
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              📶 Free WiFi
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 ${
                isNight
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              🍽️ Restaurant
            </span>
            <span
              className={`rounded-lg px-2.5 py-1 ${
                isNight
                  ? "bg-white/5 text-slate-300"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              💆 Spa
            </span>
          </div>
        </div>

        {/* Card Footer CTA */}
        <div
          className={`mt-6 border-t pt-4 ${
            isNight ? "border-white/10" : "border-slate-100"
          }`}
        >
          <Link
            to={`/hotels/${hotel.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-500/30"
          >
            <span>Explore Rooms</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default HotelCard;