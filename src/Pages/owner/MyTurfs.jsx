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
import { Upload, MapPin, IndianRupee, X } from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const sportOptions = ["Football", "Cricket", "Volleyball", "Freestyle"];

const MyTurfs = () => {
  const { user } = useAuth();
  const [turfs, setTurfs] = useState([]);

  const [editingTurf, setEditingTurf] = useState(null);
  const [loading, setLoading] = useState(false);

  // form states (same as AddTurf)
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sports, setSports] = useState([]);

  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "turfs"),
      where("ownerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTurfs(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
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
    setCoverPreview(turf.coverImage);
    setGalleryPreviews(turf.galleryImages || []);
    setCoverImage(null);
    setGalleryImages([]);
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
    setGalleryPreviews((p) => p.filter((_, idx) => idx !== i));
    setGalleryImages((p) => p.filter((_, idx) => idx !== i));
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
    if (!window.confirm("Delete this turf?")) return;
    await deleteDoc(doc(db, "turfs", id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-6">My Turfs</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div key={turf.id}>
            <div className="relative">
              <TurfCard {...turf} id={turf.id} image={turf.coverImage} />

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => openEdit(turf)}
                  className="bg-blue-600 px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTurf(turf.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* EDIT FORM (SAME AS ADDTURF) */}
            {editingTurf === turf.id && (
              <form
                onSubmit={updateTurf}
                className="bg-white p-6 mt-4 rounded-xl space-y-4 text-black"
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Turf Name"
                />

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-xl"
                    placeholder="City"
                  />
                </div>

                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-xl"
                    placeholder="Price"
                  />
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border rounded-xl"
                  rows="3"
                  placeholder="Description"
                />

                <div className="flex flex-wrap gap-2">
                  {sportOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSport(s)}
                      className={`px-3 py-1 rounded-full border ${
                        sports.includes(s)
                          ? "bg-green-500 text-white"
                          : ""
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <input
                  type="file"
                  onChange={(e) => handleCoverChange(e.target.files[0])}
                />

                <input
                  type="file"
                  multiple
                  onChange={(e) => handleGalleryChange(e.target.files)}
                />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {loading ? "Updating..." : "Update Turf"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingTurf(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTurfs;
