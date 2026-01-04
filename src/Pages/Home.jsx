import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import {
  Award,
  Clock,
  Star,
  TrendingUp,
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
  const [trendingTurfs, setTrendingTurfs] = useState([]);
  const [newTurfs, setNewTurfs] = useState([]);

  /* ---------- TRENDING TURFS ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "turfs"),
      orderBy("rating", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrendingTurfs(
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

  /* ---------- NEWLY ADDED TURFS ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "turfs"),
      orderBy("createdAt", "desc"),
      limit(10)
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
        {/* ================= QUICK ACCESS (SPORTS THEME) ================= */}
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
              label: "Available Now",
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
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-5 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition" />

              {/* Content */}
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-md">
                  <item.icon className="w-7 h-7" />
                </div>

                <span className="font-semibold tracking-wide">
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ================= TRENDING TURFS ================= */}
      

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

          {newTurfs.length > 0 ? (
            <TurfCarousel turfs={newTurfs} />
          ) : (
            <p className="text-zinc-400">No turfs found</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
