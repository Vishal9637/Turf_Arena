import { useEffect, useMemo, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  X,
  Mail,
  Phone,
  User,
  Calendar,
} from "lucide-react";

const TIME_SLOTS = [
  "06:00 - 07:00",
  "07:00 - 08:00",
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
];

const getColor = (count) => {
  if (count >= 19) return "bg-red-500/30 text-red-400";
  if (count >= 11) return "bg-yellow-500/30 text-yellow-400";
  return "bg-green-500/30 text-green-400";
};

const OwnerBookings = () => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [existingTurfs, setExistingTurfs] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [users, setUsers] = useState([]);

  /* ---------- FETCH BOOKINGS ---------- */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("ownerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, async (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 🔥 CHECK WHICH TURFS STILL EXIST
      const turfIds = [...new Set(data.map((b) => b.turfId))];
      const turfMap = {};

      await Promise.all(
        turfIds.map(async (turfId) => {
          if (!turfId) return;
          const turfSnap = await getDoc(doc(db, "turfs", turfId));
          if (turfSnap.exists()) {
            turfMap[turfId] = turfSnap.data().name;
          }
        })
      );

      // ✅ KEEP BOOKINGS ONLY FOR EXISTING TURFS
      const filteredBookings = data.filter(
        (b) => turfMap[b.turfId]
      );

      setExistingTurfs(turfMap);
      setBookings(filteredBookings);
    });

    return () => unsub();
  }, [user]);

  /* ---------- MONTH FILTER ---------- */
  const monthBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.date && b.date.startsWith(selectedMonth)
    );
  }, [bookings, selectedMonth]);

  /* ---------- BUILD MATRIX ---------- */
  const turfMatrix = useMemo(() => {
    const map = {};

    monthBookings.forEach((b) => {
      if (!existingTurfs[b.turfId]) return;

      if (!map[b.turfId]) {
        map[b.turfId] = {
          turfName: existingTurfs[b.turfId],
          dates: {},
        };
      }

      if (!map[b.turfId].dates[b.date]) {
        map[b.turfId].dates[b.date] = {};
      }

      if (!map[b.turfId].dates[b.date][b.slot]) {
        map[b.turfId].dates[b.date][b.slot] = {
          count: 0,
          bookings: [],
        };
      }

      map[b.turfId].dates[b.date][b.slot].count += b.players;
      map[b.turfId].dates[b.date][b.slot].bookings.push(b);
    });

    return map;
  }, [monthBookings, existingTurfs]);

  /* ---------- OPEN SLOT ---------- */
  const openSlot = async (turfId, date, slot) => {
    const slotBookings =
      turfMatrix[turfId]?.dates?.[date]?.[slot]?.bookings || [];

    const userList = [];

    for (const b of slotBookings) {
      try {
        const snap = await getDoc(doc(db, "users", b.userId));
        userList.push({
          name: snap.exists() ? snap.data().name : b.userName,
          email: b.userEmail,
          phone: snap.exists() ? snap.data().phone : null,
          players: b.players,
        });
      } catch {
        userList.push({
          name: b.userName,
          email: b.userEmail,
          players: b.players,
        });
      }
    }

    setUsers(userList);
    setSelectedCell({ date, slot });
  };

  const closeModal = () => {
    setSelectedCell(null);
    setUsers([]);
  };

  return (
    <div className="px-6 py-8 text-white space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Turf Booking Dashboard
        </h1>

        <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-lg">
          <Calendar size={16} className="text-white" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* TURF SECTIONS */}
      {Object.keys(turfMatrix).length === 0 ? (
        <p className="text-zinc-400">
          No bookings available for this month.
        </p>
      ) : (
        <div className="space-y-10">
          {Object.entries(turfMatrix).map(([turfId, turf]) => {
            const dates = Object.keys(turf.dates).sort();

            return (
              <div
                key={turfId}
                className="bg-zinc-900 rounded-xl p-5"
              >
                <h2 className="font-semibold mb-4 text-lg">
                  {turf.turfName}
                </h2>

                <div className="overflow-x-auto">
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-xs text-zinc-400">
                          Slot
                        </th>
                        {dates.map((d) => (
                          <th
                            key={d}
                            className="p-2 text-xs text-zinc-400"
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {TIME_SLOTS.map((slot) => (
                        <tr key={slot}>
                          <td className="p-2 text-xs text-zinc-400">
                            {slot}
                          </td>

                          {dates.map((date) => {
                            const cell =
                              turf.dates[date]?.[slot];
                            const count = cell?.count || 0;

                            return (
                              <td
                                key={date + slot}
                                onClick={() =>
                                  count &&
                                  openSlot(turfId, date, slot)
                                }
                                className={`p-2 text-center text-sm rounded-md cursor-pointer ${
                                  count
                                    ? getColor(count)
                                    : "bg-zinc-800 text-zinc-500"
                                }`}
                              >
                                {count || "-"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* USERS MODAL */}
      {selectedCell && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-zinc-900 w-full max-w-md rounded-xl p-5 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-zinc-400"
            >
              <X />
            </button>

            <h3 className="font-semibold mb-3">
              Users • {selectedCell.date} •{" "}
              {selectedCell.slot}
            </h3>

            {users.length === 0 ? (
              <p className="text-zinc-400 text-sm">
                No users
              </p>
            ) : (
              <div className="space-y-3">
                {users.map((u, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 p-3 rounded-lg text-sm"
                  >
                    <p className="flex items-center gap-2">
                      <User size={14} /> {u.name}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={14} /> {u.email}
                    </p>
                    {u.phone && (
                      <p className="flex items-center gap-2">
                        <Phone size={14} /> {u.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Users size={14} /> {u.players} players
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerBookings;
