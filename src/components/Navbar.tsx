import React, { useState } from "react";
import { Search, Menu, X, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/turfs?search=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Turfs", path: "/turfs" },
    { label: "Bookings", path: "/bookings" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/40 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-7 h-7 text-green-500" />
            <span className="text-xl font-bold text-green-500">
              TurfArena
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search turfs..."
                className="bg-white/70 text-gray-800 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 w-64 transition-all"
              />
            </form>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-gray-700 hover:text-green-500 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search turfs..."
                  className="bg-white/80 text-gray-800 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
                />
              </form>

              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-gray-700 hover:text-green-500 transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
