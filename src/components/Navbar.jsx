import React, { useEffect, useState } from "react";
import {
  Search,
  Menu,
  X,
  MapPin,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  onSnapshot,
  query,
  limit,
} from "firebase/firestore";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allTurfs, setAllTurfs] = useState([]);
  const [results, setResults] = useState([]);

  const navigate = useNavigate();
  const { user, role } = useAuth();

  /* ---------- REAL-TIME TURF FETCH ---------- */
  useEffect(() => {
    const q = query(collection(db, "turfs"), limit(100));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllTurfs(data);
    });

    return () => unsub();
  }, []);

  /* ---------- SEARCH FILTER ---------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = allTurfs.filter(
      (turf) =>
        turf.name?.toLowerCase().includes(q) ||
        turf.city?.toLowerCase().includes(q)
    );

    setResults(filtered.slice(0, 6));
  }, [searchQuery, allTurfs]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
    setIsMenuOpen(false);
  };

  const goToTurf = (id) => {
    setSearchQuery("");
    setResults([]);
    setIsMenuOpen(false);
    navigate(`/turfs/${id}`);
  };

  return (
    <nav className="bg-white/40 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= TOP BAR ================= */}
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="w-7 h-7 text-green-500" />
            <span className="text-xl font-bold text-green-500">
              TurfArena
            </span>
          </Link>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-8 relative">
            {/* SEARCH */}
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search turf or city..."
                className="bg-white/70 text-gray-800 pl-10 pr-4 py-2 rounded-xl w-full"
              />

              {results.length > 0 && (
                <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden">
                  {results.map((turf) => (
                    <button
                      key={turf.id}
                      onClick={() => goToTurf(turf.id)}
                      className="flex items-center gap-3 px-4 py-3 w-full hover:bg-green-50"
                    >
                      <img
                        src={turf.coverImage}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="text-left">
                        <p className="font-medium">{turf.name}</p>
                        <p className="text-sm text-gray-500">
                          {turf.city}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LINKS */}
            <Link to="/" className="text-gray-700 hover:text-green-500">
              Home
            </Link>
            <Link to="/turfs" className="text-gray-700 hover:text-green-500">
              Turfs
            </Link>

            {/* AUTH */}
            {!user ? (
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <LogIn size={16} /> Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-gray-700"
                >
                  <User size={18} /> Profile
                </Link>

                {role === "owner" && (
                  <Link
                    to="/owner/dashboard"
                    className="text-green-600 font-semibold"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {/* SEARCH */}
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search turf or city..."
              className="w-full bg-white px-4 py-2 rounded-xl"
            />

            {/* SEARCH RESULTS */}
            {results.map((turf) => (
              <button
                key={turf.id}
                onClick={() => goToTurf(turf.id)}
                className="flex items-center gap-3 bg-white p-3 rounded-lg w-full"
              >
                <img
                  src={turf.coverImage}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-left">
                  <p className="font-medium">{turf.name}</p>
                  <p className="text-sm text-gray-500">{turf.city}</p>
                </div>
              </button>
            ))}

            {/* NAV LINKS */}
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block">
              Home
            </Link>
            <Link
              to="/turfs"
              onClick={() => setIsMenuOpen(false)}
              className="block"
            >
              Turfs
            </Link>

            {/* AUTH */}
            {!user ? (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block bg-green-500 text-white py-2 rounded-xl text-center"
              >
                Login
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center"
                >
                  Profile
                </Link>

                {role === "owner" && (
                  <Link
                    to="/owner/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center text-green-600"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded-xl"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
