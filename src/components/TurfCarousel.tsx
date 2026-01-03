import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TurfCard from "./TurfCard.tsx";

const TurfCarousel = ({ turfs }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleTurfs = 4;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleTurfs >= turfs.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, turfs.length - visibleTurfs) : prev - 1
    );
  };

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${startIndex * (100 / visibleTurfs)}%)`,
          }}
        >
          {turfs.map((turf) => (
            <div
              key={turf.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2"
            >
              <Link to={`/turf/${turf.id}`}>
                <TurfCard {...turf} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {turfs.length > visibleTurfs && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}
    </div>
  );
};

export default TurfCarousel;
