import {
  Award,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  Heart,
  MapPin,
  Share2,
  Star,
} from "lucide-react";
import React from "react";
import { useParams } from "react-router-dom";

const TurfDetails = () => {
  const turfs = [
    {
      id: 1,
      name: "Greenfield Turf",
      rating: 4.8,
      city: "Mumbai",
      price: "₹1200 / hour",
      sports: ["Football", "Cricket", "Training"],
      manager: "Rahul Sports Group",
      description:
        "Premium sports turf with international-standard grass, flood lights, locker rooms, and parking. Ideal for professional matches, training sessions, and tournaments.",
      image:
        "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=2000&q=80",
      backdrop:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=2000&q=80",
      amenities: [
        "Flood Lights",
        "Parking",
        "Changing Room",
        "Washroom",
      ],
      awards: ["Top Rated Turf 2024", "Players Choice Award"],
      established: "2019",
      availability: "Open Today",
      language: "English / Hindi",
      location: "Andheri West, Mumbai",
      reviewsScore: 92,
    },
    {
      id: 2,
      name: "Arena Sports Hub",
      rating: 4.6,
      city: "Pune",
      price: "₹1000 / hour",
      sports: ["Box Cricket", "Football"],
      manager: "Arena Sports Pvt Ltd",
      description:
        "Modern multi-sport arena with premium turf quality, coaching facilities, and night-game lighting. Popular for corporate and weekend matches.",
      image:
        "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=2000&q=80",
      backdrop:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=2000&q=80",
      amenities: ["Parking", "Flood Lights", "Cafe"],
      awards: ["Best Sports Facility – Pune"],
      established: "2020",
      availability: "Limited Slots",
      language: "English / Marathi",
      location: "Baner, Pune",
      reviewsScore: 89,
    },
  ];

  const { id } = useParams();
  const turf = turfs.find((t) => t.id === Number(id)) || turfs[0];

  return (
    <div>
      {/* HERO */}
      <div className="relative h-[90vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${turf.backdrop || turf.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block">
              <img
                src={turf.image}
                alt={turf.name}
                className="rounded-lg shadow-xl aspect-[2/3] object-cover"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-green-400 fill-current" />
                  <span className="text-green-400 font-semibold">
                    {turf.rating} Rating
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{turf.availability}</span>
                </div>

                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">
                    Established {turf.established}
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {turf.name}
              </h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {turf.sports.map((sport) => (
                  <span
                    key={sport}
                    className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm"
                  >
                    {sport}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="bg-green-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-green-400 transition-colors">
                  Book Now
                </button>

                <button className="bg-gray-800/80 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save Turf
                </button>

                <button className="bg-gray-800/80 backdrop-blur-sm text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="md:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {turf.description}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Amenities & Highlights</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {turf.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg"
                  >
                    <Award className="w-5 h-5 text-green-400" />
                    <span>{item}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span>Reviews Score: {turf.reviewsScore}%</span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div>
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold mb-4">Turf Info</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-gray-400">Manager</dt>
                    <dd>{turf.manager}</dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="text-gray-400">Price</dt>
                    <dd className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      {turf.price}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="text-gray-400">Location</dt>
                    <dd className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {turf.location}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="text-gray-400">Language</dt>
                    <dd className="flex items-center gap-1">
                      <Globe className="w-4 h-4 text-purple-500" />
                      {turf.language}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TurfDetails;
