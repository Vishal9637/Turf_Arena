import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Calendar, Clock, Users, IndianRupee, MapPin } from "lucide-react";

const TIME_SLOTS = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

const TurfBooking = () => {
  const { turfId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [turf, setTurf] = useState(null);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [players, setPlayers] = useState(1);
  const [slotBookings, setSlotBookings] = useState(0);
  const [loading, setLoading] = useState(false);

  /* ---------- FETCH TURF ---------- */
  useEffect(() => {
    const fetchTurf = async () => {
      const snap = await getDoc(doc(db, "turfs", turfId));
      if (snap.exists()) {
        setTurf({ id: snap.id, ...snap.data() });
      }
    };
    fetchTurf();
  }, [turfId]);

  /* ---------- FETCH SLOT BOOKINGS ---------- */
  useEffect(() => {
    if (!date || !slot) return;

    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        where("turfId", "==", turfId),
        where("date", "==", date),
        where("slot", "==", slot)
      );

      const snap = await getDocs(q);
      const totalPlayers = snap.docs.reduce(
        (sum, d) => sum + d.data().players,
        0
      );

      setSlotBookings(totalPlayers);
    };

    fetchBookings();
  }, [date, slot, turfId]);

  /* ---------- PRICE CALCULATION ---------- */
  const pricePerHour = turf?.price || 0;
  const totalPrice = pricePerHour * players;

  /* ---------- CONFIRM BOOKING ---------- */
  const confirmBooking = async () => {
    if (!date || !slot) return alert("Select date & time slot");

    if (players + slotBookings > 30) {
      return alert("Slot capacity exceeded");
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "bookings"), {
        turfId,
        turfName: turf.name,
        ownerId: turf.ownerId,
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        date,
        slot,
        players,
        pricePerHour,
        totalAmount: totalPrice,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      navigate("/booking-confirmation", {
        state: {
          turf,
          date,
          slot,
          players,
          totalPrice,
        },
      });
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!turf) {
    return (
      <p className="text-center mt-20 text-zinc-400">
        Loading turf details...
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-white space-y-8">
      {/* ---------- TURF INFO ---------- */}
      <div className="bg-zinc-900 rounded-2xl p-6 space-y-2">
        <h1 className="text-3xl font-bold">{turf.name}</h1>
        <div className="flex items-center gap-4 text-zinc-400 text-sm">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {turf.city}
          </div>
          <div className="flex items-center gap-1 text-green-400 font-semibold">
            <IndianRupee size={14} />
            {turf.price} / player
          </div>
        </div>
      </div>

      {/* ---------- BOOKING FORM ---------- */}
      <div className="bg-zinc-900 p-6 rounded-2xl space-y-6">
        {/* Date */}
        <div>
          <label className="text-sm text-zinc-300 flex items-center gap-2 mb-1">
            <Calendar size={16} /> Date
          </label>
          <input
            type="date"
            className="w-full p-3 bg-zinc-800 rounded-xl"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Slot */}
        <div>
          <label className="text-sm text-zinc-300 flex items-center gap-2 mb-1">
            <Clock size={16} /> Time Slot
          </label>
          <select
            className="w-full p-3 bg-zinc-800 rounded-xl"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
          >
            <option value="">Select Slot</option>
            {TIME_SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {slot && (
            <p className="text-sm text-zinc-400 mt-2">
              Already booked: {slotBookings}/30 players
            </p>
          )}
        </div>

        {/* Players */}
        <div>
          <label className="text-sm text-zinc-300 flex items-center gap-2 mb-1">
            <Users size={16} /> Number of Players
          </label>
          <input
            type="number"
            min="1"
            max="30"
            className="w-full p-3 bg-zinc-800 rounded-xl"
            value={players}
            onChange={(e) => setPlayers(Number(e.target.value))}
          />
        </div>

        {/* ---------- SUMMARY ---------- */}
        {(date || slot) && (
          <div className="bg-zinc-800 p-4 rounded-xl space-y-2 text-sm">
            <p><b>Date:</b> {date || "-"}</p>
            <p><b>Slot:</b> {slot || "-"}</p>
            <p><b>Players:</b> {players}</p>
            <p className="text-green-400 font-semibold text-lg">
              Total Price: ₹{totalPrice}
            </p>
          </div>
        )}

        {/* Confirm */}
        <button
          disabled={loading}
          onClick={confirmBooking}
          className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold hover:bg-green-400 transition"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default TurfBooking;
