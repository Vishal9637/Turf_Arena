import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  MapPin,
  Phone,
  Save,
  User,
  Calendar,
  Users,
  IndianRupee,
} from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [bookings, setBookings] = useState([]);

  /* ---------- FETCH USER PROFILE ---------- */
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setPhone(data.phone || "");
        setCity(data.city || "");
        setPhotoPreview(data.photoURL || user.photoURL);
      } else {
        await setDoc(ref, {
          name: user.displayName || "",
          email: user.email,
          role: "user",
          createdAt: new Date(),
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  /* ---------- FETCH USER BOOKINGS (SAFE) ---------- */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, async (snap) => {
      const bookingList = await Promise.all(
        snap.docs.map(async (d) => {
          const booking = d.data();

          const turfRef = doc(db, "turfs", booking.turfId);
          const turfSnap = await getDoc(turfRef);

          // ❌ TURF DELETED → REMOVE FROM UI
          if (!turfSnap.exists()) {
            return null;
          }

          return {
            id: d.id,
            ...booking,
            turf: turfSnap.data(),
            createdAt: booking.createdAt?.toMillis
              ? booking.createdAt.toMillis()
              : 0,
          };
        })
      );

      // ✅ REMOVE NULL (DELETED TURFS)
      const filtered = bookingList
        .filter(Boolean)
        .sort((a, b) => b.createdAt - a.createdAt);

      setBookings(filtered);
    });

    return () => unsub();
  }, [user]);

  /* ---------- SAVE PROFILE ---------- */
  const saveProfile = async () => {
    try {
      setSaving(true);

      let photoURL = photoPreview;
      if (photo) {
        photoURL = await uploadToCloudinary(photo);
      }

      await updateDoc(doc(db, "users", user.uid), {
        name,
        phone,
        city,
        photoURL,
        updatedAt: new Date(),
      });

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-zinc-400">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white space-y-14">
      {/* ================= PROFILE ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-zinc-900 rounded-2xl p-8 grid md:grid-cols-3 gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700">
              <img
                src={
                  photoPreview ||
                  "https://ui-avatars.com/api/?name=User&background=0f172a&color=fff"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label className="cursor-pointer text-sm flex items-center gap-2 text-zinc-300 hover:text-white">
              <Upload size={16} />
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                  setPhotoPreview(
                    URL.createObjectURL(e.target.files[0])
                  );
                }}
              />
            </label>
          </div>

          {/* Form */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="text-sm text-zinc-400">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 text-zinc-500" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400">Email</label>
              <input
                value={user.email}
                disabled
                className="w-full p-3 bg-zinc-800 rounded-xl text-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-400">Phone</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-3 text-zinc-500" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400">City</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 text-zinc-500" />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
                />
              </div>
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold flex justify-center gap-2"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MY BOOKINGS ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-zinc-400">
            You don’t have any active bookings.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookings.map((b) => {
              const isCancelled = b.status === "cancelled";

              return (
                <div
                  key={b.id}
                  onClick={() =>
                    navigate("/booking-confirmation", {
                      state: {
                        bookingId: b.id,
                        turf: b.turf,
                        date: b.date,
                        slot: b.slot,
                        players: b.players,
                        totalPrice: b.totalAmount,
                      },
                    })
                  }
                  className={`rounded-xl overflow-hidden cursor-pointer transition
                    ${
                      isCancelled
                        ? "bg-zinc-900 opacity-80 ring-1 ring-red-500/40"
                        : "bg-zinc-900 hover:ring-2 hover:ring-green-500"
                    }
                  `}
                >
                  {/* Cover */}
                  <div className="h-48 bg-black">
                    <img
                      src={b.turf.coverImage}
                      alt={b.turfName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-semibold">
                      {b.turfName}
                    </h3>

                    <div className="text-sm text-zinc-300 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {b.date} • {b.slot}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        {b.players} Players
                      </div>

                      <div className="flex items-center gap-2 text-green-400">
                        <IndianRupee size={14} />
                        ₹{b.totalAmount}
                      </div>
                    </div>

                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        isCancelled
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
