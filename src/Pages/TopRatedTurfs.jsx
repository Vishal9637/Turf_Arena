import { Star, Trophy, MapPin } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TopRatedTurfs = () => {
  const turfs = [
    {
      id: 1,
      name: "Greenfield Turf",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      city: "Mumbai",
      bookings: "12K+",
      rank: 1,
    },
    {
      id: 2,
      name: "Arena Sports Hub",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=800&q=80",
      city: "Pune",
      bookings: "9K+",
      rank: 2,
    },
    {
      id: 3,
      name: "Urban Kick Turf",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
      city: "Delhi",
      bookings: "10K+",
      rank: 3,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Trophy className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold">Top Rated Turfs</h1>
      </motion.div>

      {/* List */}
      <div className="space-y-6">
        {turfs.map((turf, index) => (
          <motion.div
            key={turf.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={`/turf/${turf.id}`}>
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex">
                  {/* Rank */}
                  <div className="w-16 bg-green-500 flex items-center justify-center text-black font-bold text-xl">
                    #{turf.rank}
                  </div>

                  {/* Image */}
                  <div className="relative w-48">
                    <img
                      src={turf.image}
                      alt={turf.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-white">
                        {turf.name}
                      </h2>

                      <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-green-400 fill-current" />
                        <span className="text-sm font-medium text-white">
                          {turf.rating}
                        </span>
                      </div>
                    </div>

                    <div className="text-gray-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{turf.city}</span>
                      <span className="mx-2">•</span>
                      <span>{turf.bookings} bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopRatedTurfs;
