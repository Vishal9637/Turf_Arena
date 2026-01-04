import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  X,
} from "lucide-react";

const OwnerBookings = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  /* ---------- FETCH BOOKINGS (NEWEST FIRST) ---------- */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc") // ✅ NEW BOOKINGS ON TOP
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  /* ---------- OPEN BOOKING DETAILS ---------- */
  const openBookingDetails = async (booking) => {
    setSelectedBooking(booking);

    const userRef = doc(db, "users", booking.userId);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      setUserDetails(snap.data());
    }
  };

  const closeDetails = () => {
    setSelectedBooking(null);
    setUserDetails(null);
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-zinc-400">
        Loading bookings...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Turf Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-zinc-400">No bookings yet.</p>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => openBookingDetails(booking)}
              className="bg-zinc-900 rounded-2xl p-6 space-y-3 cursor-pointer hover:bg-zinc-800 transition"
            >
              {/* Turf */}
              <div className="flex items-center gap-2 text-lg font-semibold">
                <MapPin className="text-green-400" />
                {booking.turfName}
              </div>

              {/* Booking Info */}
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <Calendar className="text-green-400" />
                  {booking.date} • {booking.slot}
                </div>

                <div className="flex items-center gap-2">
                  <Users className="text-green-400" />
                  {booking.players} Players
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  booking.status === "cancelled"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {selectedBooking && userDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 w-full max-w-lg rounded-2xl p-6 relative space-y-5">
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold">
              Booking Details
            </h2>

            {/* Turf */}
            <div>
              <p className="text-zinc-400 text-sm">Turf</p>
              <p className="font-semibold">
                {selectedBooking.turfName}
              </p>
            </div>

            {/* Booking */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Calendar className="inline mr-1 text-green-400" />
                {selectedBooking.date}
              </div>

              <div>
                <Users className="inline mr-1 text-green-400" />
                {selectedBooking.players} Players
              </div>
            </div>

            {/* User Info */}
            <div className="border-t border-zinc-800 pt-4 space-y-2">
              <h3 className="font-semibold">User Details</h3>

              <p className="flex items-center gap-2">
                <User size={16} /> {userDetails.name}
              </p>

              <p className="flex items-center gap-2">
                <Mail size={16} /> {selectedBooking.userEmail}
              </p>

              {userDetails.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} /> {userDetails.phone}
                </p>
              )}

              {userDetails.city && (
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> {userDetails.city}
                </p>
              )}
            </div>

            {/* Status */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                selectedBooking.status === "cancelled"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {selectedBooking.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
