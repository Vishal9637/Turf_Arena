import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { Award, Clock, Star, TrendingUp } from "lucide-react";
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
      const data = snapshot.docs.map((doc) => {
        const turf = doc.data();
        return {
          id: doc.id,
          ...turf,
          image: turf.coverImage, // ✅ IMAGE FIX
          rating: turf.rating || 4.5,
        };
      });

      setTrendingTurfs(data);
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
      const data = snapshot.docs.map((doc) => {
        const turf = doc.data();
        return {
          id: doc.id,
          ...turf,
          image: turf.coverImage, // ✅ IMAGE FIX
          rating: turf.rating || 4.5,
        };
      });

      setNewTurfs(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Hero />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: TrendingUp,
              label: "Trending",
              path: "/turfs?sort=trending",
              color: "bg-green-500",
            },
            {
              icon: Star,
              label: "Top Rated",
              path: "/turfs?sort=top-rated",
              color: "bg-emerald-500",
            },
            {
              icon: Clock,
              label: "Available Now",
              path: "/turfs?status=available",
              color: "bg-blue-500",
            },
            {
              icon: Award,
              label: "Premium",
              path: "/turfs?type=premium",
              color: "bg-purple-500",
            },
          ].map((category, index) => (
            <Link
              key={index}
              to={category.path}
              className={`${category.color} p-4 rounded-xl flex items-center justify-center gap-2 text-white hover:opacity-80 transition-opacity`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium">{category.label}</span>
            </Link>
          ))}
        </div>

        {/* Trending Turfs */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              Trending Turfs
            </h2>

            <Link
              to="/turfs?sort=trending"
              className="text-green-500 hover:text-green-400"
            >
              View All
            </Link>
          </div>

          {trendingTurfs.length > 0 ? (
            <TurfCarousel turfs={trendingTurfs} />
          ) : (
            <p className="text-zinc-400">No turfs found</p>
          )}
        </section>

        {/* Newly Added Turfs */}
        <section className="mb-12">
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
