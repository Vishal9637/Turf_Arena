import React from "react";
import { MapPin, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const featuredTurfs = [
  {
    id: 1,
    name: "Greenfield Turf",
    rating: 4.8,
    city: "Mumbai",
    description:
      "Premium football and cricket turf with international-standard grass, flood lights, locker rooms, and ample parking. Perfect for night matches and tournaments.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 2,
    name: "Arena Sports Hub",
    rating: 4.6,
    city: "Pune",
    description:
      "A modern multi-sport turf facility offering football, box cricket, and training sessions. Ideal for corporate matches and weekend games.",
    image:
      "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=2000&q=80",
  },
];

const Hero = () => {
  const [currentTurf, setCurrentTurf] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTurf((prev) => (prev + 1) % featuredTurfs.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const turf = featuredTurfs[currentTurf];

  return (
    <div className="relative h-[90vh] bg-gradient-to-b from-transparent to-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 gradient-mask"
        style={{
          backgroundImage: `url('${turf.image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-green-400 fill-current" />
              <span className="text-green-400 font-semibold">
                {turf.rating} Rating
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <MapPin className="w-5 h-5 text-zinc-300" />
              <span className="text-zinc-300">{turf.city}</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
            {turf.name}
          </h1>

          <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-xl">
            {turf.description}
          </p>

          <div className="flex items-center gap-4">
            <Link
              to={`/turf/${turf.id}`}
              className="bg-green-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-green-400 transition-all hover:scale-105 duration-300"
            >
              <Calendar className="w-5 h-5" />
              Book Now
            </Link>

            <Link
              to={`/turf/${turf.id}`}
              className="bg-zinc-900/80 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all hover:scale-105 duration-300"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-8 right-6 flex gap-2">
          {featuredTurfs.map((_, index) => (
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
