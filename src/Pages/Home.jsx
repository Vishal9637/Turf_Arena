import React from "react";
import Hero from "../components/Hero.tsx";
import { Award, Clock, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import TurfCarousel from "../components/TurfCarousel.tsx";

const Home = () => {
  const trendingTurfs = [
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

  const upcomingTurfs = [
    {
      id: 6,
      name: "NextGen Turf Arena",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
      city: "Navi Mumbai",
      sports: ["Football", "Cricket"],
    },
    {
      id: 7,
      name: "Elite Sports Complex",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?auto=format&fit=crop&w=800&q=80",
      city: "Chennai",
      sports: ["Multi Sport"],
    },
  ];

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

          <TurfCarousel turfs={trendingTurfs} />
        </section>

        {/* Upcoming Turfs */}
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

          <TurfCarousel turfs={upcomingTurfs} />
        </section>
      </main>
    </div>
  );
};

export default Home;
