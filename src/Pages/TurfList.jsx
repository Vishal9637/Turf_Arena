import { SlidersHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import TurfCard from "../components/TurfCard";

const TurfList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const [turfs, setTurfs] = useState([]);

  /* ---------- FETCH TURFS ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "turfs"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const turf = doc.data();
        return {
          id: doc.id,
          name: turf.name,
          city: turf.city,
          sports: turf.sports || [],
          price: turf.price,
          rating: turf.rating || 4.5,
          image: turf.coverImage, // ✅ image mapping
        };
      });

      setTurfs(data);
    });

    return () => unsubscribe();
  }, []);

  /* ---------- SEARCH FILTER ---------- */
  const filteredTurfs = search
    ? turfs.filter(
        (turf) =>
          turf.name.toLowerCase().includes(search.toLowerCase()) ||
          turf.city.toLowerCase().includes(search.toLowerCase())
      )
    : turfs;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {search ? `Search Results for "${search}"` : "Popular Turfs"}
        </h1>

        <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl hover:bg-gray-900 transition-colors">
          <SlidersHorizontal />
          Filters
        </button>
      </div>

      {/* Grid */}
      {filteredTurfs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTurfs.map((turf) => (
            <TurfCard
              key={turf.id}
              id={turf.id}
              name={turf.name}
              image={turf.image}
              city={turf.city}
              sports={turf.sports}
              price={turf.price}
              rating={turf.rating}
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-400">No turfs found</p>
      )}
    </div>
  );
};

export default TurfList;
