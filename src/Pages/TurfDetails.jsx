import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  MapPin,
  Star,
  Calendar,
  User,
  Phone,
  Mail,
} from "lucide-react";

const TurfDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [turf, setTurf] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH TURF ---------- */
  useEffect(() => {
    const fetchTurf = async () => {
      const snap = await getDoc(doc(db, "turfs", id));
      if (snap.exists()) {
        const turfData = { id: snap.id, ...snap.data() };
        setTurf(turfData);

        // fetch owner details
        if (turfData.ownerId) {
          const ownerSnap = await getDoc(
            doc(db, "users", turfData.ownerId)
          );
          if (ownerSnap.exists()) {
            setOwner(ownerSnap.data());
          }
        }
      }
      setLoading(false);
    };

    fetchTurf();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-20 text-zinc-400">
        Loading turf details...
      </p>
    );
  }

  if (!turf) {
    return (
      <p className="text-center mt-20 text-red-400">
        Turf not found
      </p>
    );
  }

  return (
    <div className="text-white">
      {/* ---------- HERO SECTION ---------- */}
      <div className="relative h-[65vh]">
        <img
          src={turf.coverImage}
          alt={turf.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6 flex items-end gap-6">
            <div className="w-40 h-56 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl bg-zinc-900">
              <img
                src={turf.coverImage}
                alt={turf.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="pb-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {turf.name}
              </h1>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-1 text-green-400">
                  <Star className="w-4 h-4 fill-current" />
                  {turf.rating || 4.5} Rating
                </div>

                <div className="flex items-center gap-1 text-zinc-300">
                  <MapPin className="w-4 h-4" />
                  {turf.city}
                </div>

                <div className="bg-green-500 text-black px-4 py-1.5 rounded-full font-semibold">
                  ₹{turf.price}/hr
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MAIN CONTENT ---------- */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          {turf.description && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">
                About this turf
              </h2>
              <p className="text-zinc-300 leading-relaxed">
                {turf.description}
              </p>
            </section>
          )}

          {/* Sports */}
          {turf.sports?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-3">
                Sports Available
              </h2>
              <div className="flex flex-wrap gap-3">
                {turf.sports.map((sport) => (
                  <span
                    key={sport}
                    className="px-4 py-2 bg-zinc-800 rounded-full text-sm text-zinc-300"
                  >
                    {sport}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {turf.galleryImages?.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Turf Gallery
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {turf.galleryImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Turf ${index + 1}`}
                    className="h-44 w-full object-cover rounded-xl hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ---------- OWNER DETAILS ---------- */}
          {owner && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Turf Owner Details
              </h2>

              <div className="bg-zinc-900 rounded-2xl p-6 space-y-3">
                <p className="flex items-center gap-2">
                  <User className="text-green-400" size={18} />
                  <span className="font-semibold">
                    {owner.name || "Owner"}
                  </span>
                </p>

                {owner.email && (
                  <p className="flex items-center gap-2 text-zinc-300">
                    <Mail size={16} />
                    {owner.email}
                  </p>
                )}

                {owner.phone && (
                  <p className="flex items-center gap-2 text-zinc-300">
                    <Phone size={16} />
                    {owner.phone}
                  </p>
                )}

                {owner.city && (
                  <p className="flex items-center gap-2 text-zinc-300">
                    <MapPin size={16} />
                    {owner.city}
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-zinc-900 rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="text-xl font-semibold mb-3">
            Book this turf
          </h3>

          <p className="text-zinc-400 mb-6">
            Choose your slot and book instantly.
          </p>

          <button
            onClick={() => navigate(`/booking/${turf.id}`)}
            className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-400"
          >
            <Calendar className="w-5 h-5" />
            Book Now
          </button>
        </div>
      </div>

      {/* MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 p-4 border-t border-zinc-800">
        <button
          onClick={() => navigate(`/booking/${turf.id}`)}
          className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold"
        >
          Book Now • ₹{turf.price}/hr
        </button>
      </div>
    </div>
  );
};

export default TurfDetails;
