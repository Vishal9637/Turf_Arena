import { MapPin, Star } from "lucide-react";
import React from "react";

interface TurfCardProps {
  name: string;
  rating: number;
  image: string;
  city: string;
  sports: string[];
}

const TurfCard = ({ name, rating, image, city, sports }: TurfCardProps) => {
  return (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden backdrop-blur-sm group">
      <div className="relative aspect-[2/3]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover-glow"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 p-4 w-full">
            <button className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-400 transition-colors">
              Book Now
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-4 h-4 text-green-400 fill-current" />
          <span className="text-green-400 font-medium">{rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg truncate text-white">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-zinc-400 text-sm">
            <MapPin className="w-4 h-4" />
            {city}
          </div>
        </div>

        {sports && (
          <div className="flex flex-wrap gap-2">
            {sports.slice(0, 2).map((sport) => (
              <span
                key={sport}
                className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300"
              >
                {sport}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfCard;
