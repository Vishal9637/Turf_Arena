import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import {
  Clock,
  Trophy,
  Flame,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import TurfCarousel from "../components/TurfCarousel";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [newTurfs, setNewTurfs] = useState([]);

  /* ---------- NEWLY ADDED TURFS ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "turfs"),
      orderBy("createdAt", "desc"),
      limit(6) // ✅ only 6 turfs for mobile
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewTurfs(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          image: doc.data().coverImage,
          rating: doc.data().rating || 4.5,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* ================= QUICK ACCESS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {[
            {
              label: "Trending",
              icon: Flame,
              path: "/turfs?sort=trending",
              gradient: "from-green-500 to-emerald-500",
            },
            {
              label: "Top Rated",
              icon: Trophy,
              path: "/turfs?sort=top-rated",
              gradient: "from-yellow-400 to-orange-500",
            },
            {
              label: "Available",
              icon: Zap,
              path: "/turfs?status=available",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              label: "Premium",
              icon: Shield,
              path: "/turfs?type=premium",
              gradient: "from-purple-500 to-pink-500",
            },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`rounded-2xl bg-gradient-to-br ${item.gradient} p-5 text-white shadow-lg flex flex-col items-center gap-3`}
            >
              <div className="w-14 h-14 rounded-full bg-black/30 flex items-center justify-center">
                <item.icon className="w-7 h-7" />
              </div>
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* ================= NEWLY ADDED TURFS ================= */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-green-500" />
              Newly Added Turfs
            </h2>

            <Link
              to="/turfs?sort=new"
              className="text-green-500 hover:text-green-400"
            >
              View All
            </Link>
          </div>

          {/* DESKTOP → CAROUSEL */}
          <div className="hidden md:block">
            <TurfCarousel turfs={newTurfs} />
          </div>

          {/* MOBILE → 2 CARDS PER ROW */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            {newTurfs.map((turf) => (
              <Link
                key={turf.id}
                to={`/turfs/${turf.id}`}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow"
              >
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="h-28 w-full object-cover"
                />
                <div className="p-3 space-y-1">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {turf.name}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">
                    {turf.city}
                  </p>
                  <p className="text-xs text-green-400 font-semibold">
                    ₹{turf.price}/hr
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
