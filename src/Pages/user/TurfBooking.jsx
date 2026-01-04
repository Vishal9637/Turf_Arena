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
import {
  Calendar,
  Users,
  IndianRupee,
  MapPin,
  Clock,
  Minus,
  Plus,
} from "lucide-react";

const MAX_PLAYERS_PER_SLOT = 22;

/* 🕘 UPDATED TIME SLOTS (9 AM – 12 PM added) */
const TIME_SLOTS = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
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
  const [slotBookings, setSlotBookings] = useState({});
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

  /* ---------- FETCH BOOKINGS PER SLOT ---------- */
  useEffect(() => {
    if (!date) return;

    const fetchBookings = async () => {
      const q = query(
        collection(db, "bookings"),
        where("turfId", "==", turfId),
        where("date", "==", date)
      );

      const snap = await getDocs(q);
      const counts = {};

      snap.docs.forEach((doc) => {
        const s = doc.data().slot;
        counts[s] = (counts[s] || 0) + doc.data().players;
      });

      setSlotBookings(counts);
    };

    fetchBookings();
  }, [date, turfId]);

  /* ---------- PRICE ---------- */
  const pricePerPlayer = turf?.price || 0;
  const totalPrice = players * pricePerPlayer;

  /* ---------- SLOT COLOR (BookMyShow Style) ---------- */
  const getSlotStyle = (count = 0) => {
    if (count >= MAX_PLAYERS_PER_SLOT)
      return "bg-zinc-800 text-zinc-500 cursor-not-allowed";

    if (count >= 19)
      return "bg-red-500/20 text-red-400 border-red-400";

    if (count >= 11)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-400";

    return "bg-green-500/20 text-green-400 border-green-400";
  };

  /* ---------- CONFIRM BOOKING ---------- */
  const confirmBooking = async () => {
    if (!date || !slot) return alert("Select date & time slot");

    const alreadyBooked = slotBookings[slot] || 0;

    if (players + alreadyBooked > MAX_PLAYERS_PER_SLOT) {
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
        pricePerPlayer,
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
    <div className="max-w-6xl mx-auto px-6 py-10 text-white space-y-10">
      {/* ---------- TURF INFO ---------- */}
      <div className="bg-zinc-900 rounded-2xl p-6">
        <h1 className="text-3xl font-bold">{turf.name}</h1>
        <div className="flex gap-4 text-sm text-zinc-400 mt-2">
          <span className="flex items-center gap-1">
            <MapPin size={14} /> {turf.city}
          </span>
          <span className="flex items-center gap-1 text-green-400 font-semibold">
            <IndianRupee size={14} /> {turf.price} / player
          </span>
        </div>
      </div>

      {/* ---------- DATE ---------- */}
      <div>
        <label className="text-sm text-zinc-300 flex items-center gap-2 mb-2">
          <Calendar size={16} /> Select Date
        </label>
        <input
          type="date"
          className="bg-zinc-900 p-3 rounded-xl w-full md:w-64"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSlot("");
          }}
        />
      </div>

      {/* ---------- TIME SLOTS ---------- */}
      {date && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={18} /> Select Time Slot
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TIME_SLOTS.map((s) => {
              const count = slotBookings[s] || 0;
              const disabled = count >= MAX_PLAYERS_PER_SLOT;

              return (
                <button
                  key={s}
                  disabled={disabled}
                  onClick={() => setSlot(s)}
                  className={`border rounded-xl p-4 text-sm text-center transition
                    ${getSlotStyle(count)}
                    ${slot === s ? "ring-2 ring-white" : ""}
                  `}
                >
                  <p className="font-semibold">{s}</p>
                  <p className="text-xs mt-1">
                    {count}/{MAX_PLAYERS_PER_SLOT} players
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- PLAYER SELECT ---------- */}
      {slot && (
        <div className="bg-zinc-900 p-6 rounded-2xl space-y-4 max-w-md">
          <h3 className="font-semibold flex items-center gap-2">
            <Users size={18} /> Number of Players
          </h3>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setPlayers((p) => Math.max(1, p - 1))}
              className="p-2 bg-zinc-800 rounded-lg"
            >
              <Minus />
            </button>

            <span className="text-2xl font-bold">{players}</span>

            <button
              onClick={() => setPlayers((p) => p + 1)}
              className="p-2 bg-zinc-800 rounded-lg"
            >
              <Plus />
            </button>
          </div>

          <p className="text-green-400 font-semibold text-lg">
            Total: ₹{totalPrice}
          </p>
        </div>
      )}

      {/* ---------- CONFIRM ---------- */}
      {slot && (
        <button
          disabled={loading}
          onClick={confirmBooking}
          className="w-full md:w-1/3 bg-green-500 text-black py-3 rounded-xl font-semibold hover:bg-green-400 transition"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      )}
    </div>
  );
};

export default TurfBooking;
