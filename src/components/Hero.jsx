import React, { useEffect, useState } from "react";
import { MapPin, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "../firebase";

const Hero = () => {
  const [allTurfs, setAllTurfs] = useState([]);
  const [heroTurfs, setHeroTurfs] = useState([]);
  const [currentTurf, setCurrentTurf] = useState(0);
  const [userCity, setUserCity] = useState(null);

  /* ---------- USER LOCATION ---------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village;

          if (city) setUserCity(city.toLowerCase());
        } catch {}
      },
      () => {}
    );
  }, []);

  /* ---------- FETCH TURFS ---------- */
  useEffect(() => {
    const q = query(collection(db, "turfs"), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setAllTurfs(list);
    });

    return () => unsub();
  }, []);

  /* ---------- LOCATION FILTER ---------- */
  useEffect(() => {
    if (!allTurfs.length) return;

    if (userCity) {
      const local = allTurfs.filter(
        (t) => t.city?.toLowerCase().includes(userCity)
      );
      if (local.length) {
        setHeroTurfs(local.slice(0, 5));
        return;
      }
    }

    setHeroTurfs(allTurfs.slice(0, 5));
  }, [allTurfs, userCity]);

  /* ---------- AUTO SLIDER ---------- */
  useEffect(() => {
    if (!heroTurfs.length) return;
    const timer = setInterval(() => {
      setCurrentTurf((p) => (p + 1) % heroTurfs.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroTurfs]);

  if (!heroTurfs.length) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-zinc-400">
        Loading featured turfs...
      </div>
    );
  }

  const turf = heroTurfs[currentTurf];

  return (
    <section className="relative min-h-[70vh] bg-gradient-to-b from-black/70 to-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${turf.coverImage})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <div>
          <div className="flex flex-wrap gap-4 mb-4">
            <span className="flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full">
              <Star className="w-4 h-4 text-green-400 fill-current" />
              <span className="text-green-400 font-semibold">
                {turf.rating || 4.5}
              </span>
            </span>

            <span className="flex items-center gap-1 bg-black/50 px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-zinc-300" />
              <span className="text-zinc-300">{turf.city}</span>
            </span>

            <span className="bg-green-500 text-black px-4 py-1.5 rounded-full font-semibold">
              ₹{turf.price}/hr
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {turf.name}
          </h1>

          {turf.description && (
            <p className="text-zinc-300 text-base max-w-xl mb-8 line-clamp-3">
              {turf.description}
            </p>
          )}

          <div className="flex gap-4">
            <Link
              to={`/turfs/${turf.id}`}
              className="bg-green-500 text-black px-7 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-400 transition"
            >
              <Calendar className="w-5 h-5" />
              Book Now
            </Link>

            <Link
              to={`/turfs/${turf.id}`}
              className="bg-zinc-900/80 text-white px-7 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={turf.coverImage}
              alt={turf.name}
              className="w-full h-[420px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>

        {/* SLIDER DOTS */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          {heroTurfs.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentTurf(i)}
              className={`h-1.5 rounded-full transition-all ${
                currentTurf === i
                  ? "bg-green-500 w-8"
                  : "bg-zinc-600 w-4"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
