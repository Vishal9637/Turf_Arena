import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import TurfCard from "../../components/TurfCard";
import {
  MapPin,
  IndianRupee,
  X,
  Map,
} from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const sportOptions = ["Football", "Cricket", "Volleyball", "Freestyle"];

const MyTurfs = () => {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);

  const [editingTurf, setEditingTurf] = useState(null);
  const [loading, setLoading] = useState(false);

  // form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sports, setSports] = useState([]);
  const [mapLink, setMapLink] = useState("");

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  /* ---------- FETCH TURFS ---------- */
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "turfs"),
      where("ownerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTurfs(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  /* ---------- OPEN EDIT ---------- */
  const openEdit = (turf) => {
    setEditingTurf(turf.id);
    setName(turf.name);
    setCity(turf.city);
    setPrice(turf.price);
    setDescription(turf.description || "");
    setSports(turf.sports || []);
    setMapLink(turf.mapLink || "");
    setCoverPreview(turf.coverImage || null);
    setGalleryPreviews(turf.galleryImages || []);
    setCoverImage(null);
    setGalleryImages([]);
  };

  /* ---------- MAP EMBED ---------- */
  const getEmbedMap = () => {
    if (!mapLink) return null;
    return `https://www.google.com/maps?q=${encodeURIComponent(
      mapLink
    )}&output=embed`;
  };

  /* ---------- SPORTS ---------- */
  const toggleSport = (sport) => {
    setSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  /* ---------- IMAGES ---------- */
  const handleCoverChange = (file) => {
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (files) => {
    const imgs = Array.from(files);
    setGalleryImages(imgs);
    setGalleryPreviews(imgs.map((i) => URL.createObjectURL(i)));
  };

  const removeGalleryImage = (i) => {
    setGalleryImages((p) => p.filter((_, idx) => idx !== i));
    setGalleryPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  /* ---------- UPDATE ---------- */
  const updateTurf = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const updates = {
        name,
        city,
        price: Number(price),
        description,
        sports,
        mapLink,
      };

      if (coverImage) {
        updates.coverImage = await uploadToCloudinary(coverImage);
      }

      if (galleryImages.length > 0) {
        updates.galleryImages = await Promise.all(
          galleryImages.map((img) => uploadToCloudinary(img))
        );
      }

      await updateDoc(doc(db, "turfs", editingTurf), updates);
      setEditingTurf(null);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- DELETE ---------- */
  const deleteTurf = async (id) => {
    if (!window.confirm("Delete this turf permanently?")) return;
    await deleteDoc(doc(db, "turfs", id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">My Turfs</h1>

      {/* TURF GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div key={turf.id} className="relative">
            {/* ✅ COVER IMAGE PASSED */}
            <TurfCard {...turf} image={turf.coverImage} />

            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => openEdit(turf)}
                className="bg-blue-600 px-3 py-1 rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTurf(turf.id)}
                className="bg-red-600 px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingTurf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 relative">
            <button
              onClick={() => setEditingTurf(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-6">
              Edit Turf
            </h2>

            <form onSubmit={updateTurf} className="space-y-5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-xl"
                placeholder="Turf Name"
              />

              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-zinc-400" />
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
                  placeholder="City"
                />
              </div>

              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 text-zinc-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
                  placeholder="Price per hour"
                />
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded-xl"
                rows="3"
                placeholder="Description"
              />

              {/* SPORTS */}
              <div className="flex flex-wrap gap-2">
                {sportOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSport(s)}
                    className={`px-3 py-1 rounded-full border ${
                      sports.includes(s)
                        ? "bg-green-500 text-black"
                        : "border-zinc-700"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* MAP */}
              <div>
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                  <Map size={14} /> Google Maps Location
                </div>
                <input
                  value={mapLink}
                  onChange={(e) => setMapLink(e.target.value)}
                  className="w-full p-3 bg-zinc-800 rounded-xl"
                  placeholder="Paste Google Maps link or address"
                />

                {mapLink && (
                  <iframe
                    title="Map"
                    src={getEmbedMap()}
                    className="w-full h-48 mt-3 rounded-xl border border-zinc-700"
                    loading="lazy"
                  />
                )}
              </div>

              {/* COVER */}
              <input
                type="file"
                onChange={(e) =>
                  handleCoverChange(e.target.files[0])
                }
              />

              {coverPreview && (
                <img
                  src={coverPreview}
                  className="h-40 rounded-xl object-cover"
                />
              )}

              {/* GALLERY */}
              <input
                type="file"
                multiple
                onChange={(e) =>
                  handleGalleryChange(e.target.files)
                }
              />

              <div className="flex flex-wrap gap-3">
                {galleryPreviews.map((img, i) => (
                  <div key={i} className="relative w-24">
                    <img
                      src={img}
                      className="rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                disabled={loading}
                className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold"
              >
                {loading ? "Updating..." : "Update Turf"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTurfs;
