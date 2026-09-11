import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const navigate = useNavigate();
  const { isNight } = useTheme();
  const [searchCity, setSearchCity] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/hotels?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate("/hotels");
    }
  };

  const quickCities = ["Goa", "Mumbai", "Delhi", "Kanpur", "Jaipur", "Bangalore"];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 selection:bg-indigo-600 selection:text-white ${
        isNight ? "text-white" : "text-slate-900"
      }`}
    >
      <Navbar />

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section className="relative min-h-[96vh] overflow-hidden pt-28 pb-16 flex items-center">
        
        {/* Background Ambient Imagery & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=90"
            alt="Luxury Palace Hotel"
            className={`h-full w-full object-cover object-center scale-105 transition-all duration-1000 ${
              isNight ? "opacity-25" : "opacity-35"
            }`}
          />
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isNight
                ? "bg-gradient-to-t from-[#070A13] via-[#070A13]/85 to-transparent"
                : "bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/80 to-transparent"
            }`}
          />
          <div
            className={`absolute inset-0 transition-colors duration-700 ${
              isNight
                ? "bg-gradient-to-r from-[#070A13] via-[#070A13]/70 to-transparent"
                : "bg-gradient-to-r from-[#F8FAFC] via-[#F8FAFC]/60 to-transparent"
            }`}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 w-full">
          
          <div className="max-w-3xl">
            {/* Luxury Badge */}
            <div
              className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold backdrop-blur-md shadow-lg transition-all ${
                isNight
                  ? "border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-indigo-950/40"
                  : "border border-indigo-200 bg-white/90 text-indigo-700 shadow-slate-300/40"
              }`}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>OVER 500+ HANDPICKED LUXURY HOTELS & RESORTS</span>
            </div>

            {/* Headline */}
            <h1
              className={`font-heading mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Stay Somewhere <br />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 bg-clip-text text-transparent">
                Extraordinary.
              </span>
            </h1>

            {/* Subheading */}
            <p
              className={`mt-6 max-w-2xl text-lg leading-8 md:text-xl ${
                isNight ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Discover opulent villas, boutique suites, and scenic retreats with seamless instant booking and verified guest satisfaction.
            </p>

            {/* Glassmorphic Search Bar */}
            <form
              onSubmit={handleSearch}
              className={`mt-10 max-w-3xl rounded-3xl p-3 backdrop-blur-2xl transition-all duration-300 shadow-2xl ${
                isNight
                  ? "border border-white/15 bg-slate-900/80 shadow-indigo-950/50"
                  : "border border-slate-200 bg-white/90 shadow-slate-300/60"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row items-center">
                
                {/* City Input */}
                <div
                  className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 w-full border transition focus-within:border-indigo-500 ${
                    isNight
                      ? "bg-white/5 border-white/5 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-900"
                  }`}
                >
                  <span className="text-xl">📍</span>
                  <div className="flex-1">
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isNight ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Destination / City
                    </p>
                    <input
                      type="text"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="e.g. Goa, Mumbai, Delhi, Kanpur..."
                      className={`w-full bg-transparent text-sm font-semibold outline-none ${
                        isNight
                          ? "text-white placeholder:text-slate-500"
                          : "text-slate-900 placeholder:text-slate-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-8 py-4 font-heading font-bold text-white shadow-xl shadow-indigo-600/30 transition hover:scale-[1.02] hover:shadow-indigo-500/50 cursor-pointer"
                >
                  <span>Search Stays</span>
                  <span>→</span>
                </button>

              </div>

              {/* Quick City Pills */}
              <div
                className={`mt-3 flex flex-wrap items-center gap-2 px-2 pt-2 border-t ${
                  isNight ? "border-white/5" : "border-slate-100"
                }`}
              >
                <span
                  className={`text-xs font-semibold ${
                    isNight ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Popular:
                </span>
                {quickCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setSearchCity(c);
                      navigate(`/hotels?city=${encodeURIComponent(c)}`);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                      isNight
                        ? "border border-white/10 bg-white/5 text-slate-300 hover:border-indigo-400 hover:bg-indigo-500/20 hover:text-white"
                        : "border border-slate-200 bg-slate-100 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </form>

            {/* Social Proof */}
            <div
              className={`mt-8 flex flex-wrap items-center gap-6 text-sm ${
                isNight ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">★★★★★</span>
                <span
                  className={`font-semibold ${
                    isNight ? "text-white" : "text-slate-900"
                  }`}
                >
                  4.9/5 Average Rating
                </span>
              </div>
              <div
                className={`h-4 w-px ${
                  isNight ? "bg-white/20" : "bg-slate-300"
                }`}
              />
              <div className="flex items-center gap-2">
                <span>🛡️</span>
                <span>100% Verified Reservations</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ============================================================
          FEATURED DESTINATIONS
      ============================================================ */}
      <section
        className={`relative py-24 border-t transition-colors duration-500 ${
          isNight
            ? "bg-slate-950/60 border-white/5"
            : "bg-slate-100/60 border-slate-200/80"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
                Trending Locations
              </p>
              <h2
                className={`font-heading mt-2 text-3xl font-extrabold sm:text-4xl ${
                  isNight ? "text-white" : "text-slate-900"
                }`}
              >
                Explore Popular Destinations
              </h2>
            </div>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-500 transition hover:text-indigo-600"
            >
              <span>View All Hotels</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <DestinationCard
              name="Goa"
              tag="Beach & Sunset Villas"
              image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
              onClick={() => navigate("/hotels?city=Goa")}
              isNight={isNight}
            />

            <DestinationCard
              name="Mumbai"
              tag="Skyline & Harbor Luxury"
              image="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80"
              onClick={() => navigate("/hotels?city=Mumbai")}
              isNight={isNight}
            />

            <DestinationCard
              name="Jaipur"
              tag="Royal Palaces & Haveli"
              image="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
              onClick={() => navigate("/hotels?city=Jaipur")}
              isNight={isNight}
            />

            <DestinationCard
              name="Delhi"
              tag="Heritage & Boutique Suites"
              image="https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80"
              onClick={() => navigate("/hotels?city=Delhi")}
              isNight={isNight}
            />
          </div>

        </div>
      </section>

      {/* ============================================================
          LUXURY EXPERIENCE & BENEFITS
      ============================================================ */}
      <section className="relative py-28 overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="mx-auto max-w-2xl text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500">
              The StayEasy Standard
            </p>
            <h2
              className={`font-heading mt-3 text-4xl font-extrabold sm:text-5xl ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Why Discerning Travelers Choose Us
            </h2>
            <p
              className={`mt-4 text-base ${
                isNight ? "text-slate-400" : "text-slate-600"
              }`}
            >
              From instant verified confirmations to round-the-clock assistance, we redefine hospitality.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon="🏰"
              title="Curated Luxury Facades"
              description="Every listed property is vetted for comfort, hygiene, premium architecture, and world-class hospitality."
              isNight={isNight}
            />

            <FeatureCard
              icon="⚡"
              title="Instant Real-Time Booking"
              description="Zero hidden charges, transparent pricing per night, and guaranteed instant confirmation with smart date controls."
              isNight={isNight}
            />

            <FeatureCard
              icon="🔒"
              title="Safe & Verified Accounts"
              description="Protected authentication with OTP verification, enterprise-level JWT encryption, and dedicated owner management."
              isNight={isNight}
            />
          </div>

        </div>
      </section>

      {/* ============================================================
          CTA BANNER
      ============================================================ */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className={`relative overflow-hidden rounded-3xl p-10 md:p-16 text-center shadow-2xl transition-all ${
              isNight
                ? "border border-indigo-500/30 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 text-white"
                : "border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-900"
            }`}
          >
            <span className="text-5xl">🌟</span>
            
            <h2
              className={`font-heading mt-6 text-3xl font-extrabold sm:text-4xl md:text-5xl ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              Ready for your next unforgettable stay?
            </h2>

            <p
              className={`mx-auto mt-4 max-w-xl text-base ${
                isNight ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Browse our curated portfolio of premium accommodations and book your perfect room in seconds.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/hotels"
                className={`rounded-2xl px-8 py-4 font-heading font-bold shadow-xl transition hover:scale-105 ${
                  isNight
                    ? "bg-white text-slate-950 hover:bg-slate-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30"
                }`}
              >
                Browse All Hotels →
              </Link>
              <Link
                to="/register"
                className={`rounded-2xl border px-8 py-4 font-heading font-bold transition ${
                  isNight
                    ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                Join as Hotel Owner
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer
        className={`border-t py-12 transition-colors duration-500 ${
          isNight
            ? "border-white/10 bg-[#070A13] text-slate-400"
            : "border-slate-200 bg-slate-100 text-slate-600"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏨</span>
            <span
              className={`font-heading text-lg font-bold ${
                isNight ? "text-white" : "text-slate-900"
              }`}
            >
              StayEasy Luxury & Resorts
            </span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} StayEasy Hotel Management System. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link to="/hotels" className="hover:text-indigo-500 transition">Hotels</Link>
            <Link to="/login" className="hover:text-indigo-500 transition">Sign In</Link>
            <Link to="/register" className="hover:text-indigo-500 transition">Partner With Us</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

function DestinationCard({ name, tag, image, onClick, isNight }) {
  return (
    <div
      onClick={onClick}
      className={`group relative h-80 overflow-hidden rounded-3xl cursor-pointer shadow-xl transition duration-500 hover:-translate-y-2 ${
        isNight
          ? "border border-white/10 hover:border-indigo-500/50"
          : "border border-slate-200 hover:border-indigo-400"
      }`}
    >
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">{tag}</p>
        <h3 className="font-heading text-2xl font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
          {name}
        </h3>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, isNight }) {
  return (
    <div
      className={`group relative rounded-3xl p-8 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
        isNight
          ? "border border-white/10 bg-slate-900/60 hover:border-indigo-500/40 hover:bg-slate-900/90 text-white"
          : "border border-slate-200 bg-white/80 hover:border-indigo-300 hover:bg-white text-slate-900"
      }`}
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-inner border transition duration-300 group-hover:scale-110 ${
          isNight
            ? "bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border-white/10"
            : "bg-gradient-to-tr from-indigo-100 to-purple-100 border-indigo-200"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`font-heading mt-6 text-xl font-bold ${
          isNight ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 text-sm leading-6 ${
          isNight ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default Home;