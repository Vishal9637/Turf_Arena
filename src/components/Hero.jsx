import React, { useEffect, useState } from "react";
import { MapPin, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "../firebase";

const Hero = () => {
  const [turfs, setTurfs] = useState([]);
  const [currentTurf, setCurrentTurf] = useState(0);

  /* ---------- FETCH TURFS ---------- */
  useEffect(() => {
    const q = query(collection(db, "turfs"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTurfs(list);
    });

    return () => unsubscribe();
  }, []);

  /* ---------- AUTO SLIDER ---------- */
  useEffect(() => {
    if (turfs.length === 0) return;

    const timer = setInterval(() => {
      setCurrentTurf((prev) => (prev + 1) % turfs.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [turfs]);

  if (turfs.length === 0) {
    return (
      <div className="h-[90vh] flex items-center justify-center text-zinc-400">
        Loading featured turfs...
      </div>
    );
  }

  const turf = turfs[currentTurf];

  return (
    <div className="relative h-[90vh] bg-gradient-to-b from-transparent to-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 gradient-mask"
        style={{
          backgroundImage: `url('${turf.coverImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Rating */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-green-400 fill-current" />
              <span className="text-green-400 font-semibold">
                {turf.rating || 4.5} Rating
              </span>
            </div>

            {/* City */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <MapPin className="w-5 h-5 text-zinc-300" />
              <span className="text-zinc-300">{turf.city}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1 bg-green-500/90 text-black px-4 py-1.5 rounded-full font-semibold shadow-lg">
              ₹{turf.price}/hr
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            {turf.name}
          </h1>

          {/* Description */}
          {turf.description && (
            <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-xl">
              {turf.description}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to={`/turfs/${turf.id}`}
              className="bg-green-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-400 transition-all hover:scale-105 duration-300"
            >
              <Calendar className="w-5 h-5" />
              Book Now
            </Link>

            <Link
              to={`/turfs/${turf.id}`}
              className="bg-zinc-900/80 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all hover:scale-105 duration-300"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 right-6 flex gap-2">
          {turfs.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTurf(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentTurf === index
                  ? "bg-green-500 w-8"
                  : "bg-zinc-600 w-4 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
