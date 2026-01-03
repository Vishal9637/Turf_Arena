import { Search, SlidersHorizontal, Star, MapPin } from "lucide-react";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const TurfList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const turfs = [
    {
      id: 1,
      name: "Greenfield Turf",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80",
      city: "Mumbai",
      sports: ["Football", "Cricket"],
    },
    {
      id: 2,
      name: "Arena Sports Hub",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=800&q=80",
      city: "Pune",
      sports: ["Box Cricket", "Football"],
    },
    {
      id: 3,
      name: "Urban Kick Turf",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=800&q=80",
      city: "Delhi",
      sports: ["Football"],
    },
    {
      id: 4,
      name: "PlayZone Arena",
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80",
      city: "Bangalore",
      sports: ["Cricket", "Football"],
    },
    {
      id: 5,
      name: "KickOff Sports",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
      city: "Hyderabad",
      sports: ["Football", "Training"],
    },
  ];

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTurfs.map((turf) => (
          <Link key={turf.id} to={`/turf/${turf.id}`}>
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="relative aspect-video">
                <img
                  src={turf.image}
                  alt={turf.name}
                  className="w-full h-full object-cover"
                />

                {/* Rating */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-green-400 fill-current" />
                  <span className="text-green-400 font-medium">
                    {turf.rating}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {turf.name}
                </h2>

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    {turf.city}
                  </div>

                  <div className="flex gap-2">
                    {turf.sports.slice(0, 2).map((sport) => (
                      <span
                        key={sport}
                        className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TurfList;
