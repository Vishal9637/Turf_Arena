import { MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TurfCard = ({ id, name, rating, image, city, sports, price }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/turfs/${id}`)}
      className="bg-zinc-900/50 rounded-xl overflow-hidden backdrop-blur-sm group cursor-pointer"
    >
      <div className="relative aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 p-4 w-full">
            <button className="w-full bg-green-500 text-black py-2 rounded-lg font-semibold">
              View Details
            </button>
          </div>
        </div>

        <div className="absolute top-4 left-4 bg-green-500/90 text-black px-3 py-1 rounded-md text-sm font-semibold">
          ₹{price}/hr
        </div>

        <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-4 h-4 text-green-400 fill-current" />
          <span className="text-green-400">{rating || 4.5}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-semibold text-lg truncate text-white">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-zinc-400 text-sm">
            <MapPin size={14} /> {city}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {sports?.slice(0, 2).map((sport) => (
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
  );
};

export default TurfCard;
