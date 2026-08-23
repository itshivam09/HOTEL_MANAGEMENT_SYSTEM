import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import API from "../services/api";

function HotelDetails() {
  const { hotelId } = useParams();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get all hotels
        const hotelsResponse = await API.get("/hotels/");

        const foundHotel = hotelsResponse.data.find(
          (item) => item.id === Number(hotelId)
        );

        if (!foundHotel) {
          setError("Hotel not found");
          return;
        }

        setHotel(foundHotel);

        // Get rooms belonging to this hotel
        const roomsResponse = await API.get(`/rooms/${hotelId}`);

        setRooms(roomsResponse.data);

      } catch (err) {
        console.error(err);
        setError("Unable to load hotel information.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />

        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-10 text-center">
            <div className="text-5xl">😕</div>

            <h1 className="mt-4 text-2xl font-bold">
              {error}
            </h1>

            <Link
              to="/hotels"
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
            >
              Back to Hotels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">

        {/* Back */}
        <Link
          to="/hotels"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Hotels
        </Link>

        {/* Hotel Hero */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">

          <div className="grid lg:grid-cols-2">

            {/* Image */}
            <div className="flex min-h-[350px] items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800">
              <span className="text-8xl">🏨</span>
            </div>

            {/* Hotel info */}
            <div className="flex flex-col justify-center p-8 lg:p-12">

              <span className="mb-4 w-fit rounded-full bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Hotel
              </span>

              <h1 className="text-4xl font-bold md:text-5xl">
                {hotel.name}
              </h1>

              <div className="mt-5 space-y-3 text-slate-400">

                <p className="flex items-center gap-3">
                  <span>📍</span>
                  {hotel.city}
                </p>

                <p className="flex items-center gap-3">
                  <span>📌</span>
                  {hotel.address}
                </p>

              </div>

              {hotel.description && (
                <p className="mt-6 leading-7 text-slate-400">
                  {hotel.description}
                </p>
              )}

            </div>

          </div>

        </section>

        {/* Rooms */}
        <section className="mt-16">

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Accommodation
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Available Rooms
            </h2>

            <p className="mt-3 text-slate-500">
              Choose a room that fits your needs.
            </p>
          </div>

          {rooms.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">

              <div className="text-5xl">
                🛏️
              </div>

              <h3 className="mt-4 text-xl font-semibold">
                No rooms available
              </h3>

              <p className="mt-2 text-slate-500">
                This hotel currently has no rooms listed.
              </p>

            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  hotelId={hotel.id}
                />
              ))}
            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default HotelDetails;