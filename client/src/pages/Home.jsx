import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[92vh] overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-slate-900/20 z-10" />

          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=90"
            alt="Luxury Hotel"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto flex min-h-[92vh] w-full max-w-7xl items-center px-6 py-24">

          <div className="max-w-3xl text-white">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Find your perfect stay
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Stay somewhere
              <span className="mt-2 block text-indigo-400">
                unforgettable.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Discover beautiful hotels, comfortable rooms and memorable
              experiences. Everything you need for your perfect getaway.
            </p>

            {/* Search Card */}
            <div className="mt-10 max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">

              <div className="flex flex-col gap-3 md:flex-row">

                {/* Location */}
                <div className="flex flex-1 items-center rounded-2xl bg-white px-5">

                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-lg">
                    📍
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Location
                    </p>

                    <input
                      type="text"
                      placeholder="Where do you want to stay?"
                      className="w-full bg-transparent py-1 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                </div>

                {/* Date */}
                <div className="flex items-center rounded-2xl bg-white px-5 md:w-48">

                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    📅
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Check-in
                    </p>

                    <p className="text-sm font-medium text-slate-800">
                      Add dates
                    </p>
                  </div>

                </div>

                {/* Guests */}
                <div className="flex items-center rounded-2xl bg-white px-5 md:w-48">

                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    👤
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Guests
                    </p>

                    <p className="text-sm font-medium text-slate-800">
                      2 Guests
                    </p>
                  </div>

                </div>

                {/* Button */}
                <Link
                  to="/hotels"
                  className="flex items-center justify-center rounded-2xl bg-indigo-600 px-8 py-5 font-semibold text-white shadow-lg shadow-indigo-900/30 transition duration-300 hover:bg-indigo-500 hover:scale-[1.02]"
                >
                  Search
                  <span className="ml-2">→</span>
                </Link>

              </div>

            </div>

            {/* Trust */}
            <div className="mt-7 flex flex-wrap items-center gap-6 text-sm text-slate-300">

              <div className="flex items-center gap-2">
                <span className="text-yellow-400">★★★★★</span>
                <span>4.9/5 rating</span>
              </div>

              <div className="h-4 w-px bg-white/30"></div>

              <p>Trusted by 1,000+ guests</p>

            </div>

          </div>

        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-8 left-1/2 z-30 hidden w-full max-w-7xl -translate-x-1/2 px-6 lg:block">

          <div className="ml-auto flex w-fit items-center gap-10 rounded-2xl border border-white/20 bg-black/30 px-8 py-5 text-white backdrop-blur-xl">

            <Stat number="100+" label="Hotels" />

            <div className="h-10 w-px bg-white/20"></div>

            <Stat number="500+" label="Rooms" />

            <div className="h-10 w-px bg-white/20"></div>

            <Stat number="1K+" label="Happy Guests" />

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="bg-white py-24">

        <div className="mx-auto max-w-7xl px-6">

          {/* Heading */}
          <div className="mx-auto mb-16 max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Why StayEasy?
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Everything you need
              <span className="block text-indigo-600">
                for a perfect stay
              </span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-500">
              From finding the right hotel to making your reservation,
              StayEasy makes the entire experience simple.
            </p>

          </div>

          {/* Feature Cards */}
          <div className="grid gap-7 md:grid-cols-3">

            <Feature
              icon="🏨"
              title="Quality Hotels"
              description="Discover carefully managed hotels with comfortable rooms, premium amenities and great locations."
            />

            <Feature
              icon="⚡"
              title="Easy Booking"
              description="Find your perfect room and complete your booking in just a few simple clicks."
            />

            <Feature
              icon="🔒"
              title="Secure & Reliable"
              description="Your account and booking information are protected with secure authentication."
            />

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-24">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 to-slate-900 px-8 py-16 md:px-16">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-400">
              Start your journey
            </p>

            <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
              Ready for your next adventure?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Explore our collection of hotels and find a place that feels
              just right for you.
            </p>

            <Link
              to="/hotels"
              className="mt-8 inline-flex items-center rounded-xl bg-indigo-600 px-8 py-4 font-semibold text-white transition hover:bg-indigo-500"
            >
              Explore Hotels
              <span className="ml-2">→</span>
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div>
      <p className="text-2xl font-bold">
        {number}
      </p>

      <p className="mt-1 text-xs uppercase tracking-wider text-slate-300">
        {label}
      </p>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl">

      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl transition duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-slate-500">
        {description}
      </p>

      <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600">
        Learn more
        <span className="ml-2 transition group-hover:translate-x-1">
          →
        </span>
      </div>

    </div>
  );
}

export default Home;