import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import {
  Upload,
  MapPin,
  IndianRupee,
  X,
  Map,
} from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const AddTurf = () => {
  const { user } = useAuth();

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

  const [loading, setLoading] = useState(false);

  const sportOptions = ["Football", "Cricket", "Volleyball", "Freestyle"];

  const toggleSport = (sport) => {
    setSports((prev) =>
      prev.includes(sport)
        ? prev.filter((s) => s !== sport)
        : [...prev, sport]
    );
  };

  /* ---------- GOOGLE MAP EMBED FIX ---------- */
  const getEmbedMap = () => {
    if (!mapLink) return null;

    // If user pastes lat,lng
    if (mapLink.includes(",")) {
      return `https://www.google.com/maps?q=${encodeURIComponent(
        mapLink
      )}&output=embed`;
    }

    // Full Google Maps URL or place name
    return `https://www.google.com/maps?q=${encodeURIComponent(
      mapLink
    )}&output=embed`;
  };

  const handleCoverChange = (file) => {
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleGalleryChange = (files) => {
    const images = Array.from(files);
    setGalleryImages((prev) => [...prev, ...images]);
    setGalleryPreviews((prev) =>
      [...prev, ...images.map((img) => URL.createObjectURL(img))]
    );
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTurf = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      alert("Cover image is required");
      return;
    }

    try {
      setLoading(true);

      const coverUrl = await uploadToCloudinary(coverImage);
      const galleryUrls = await Promise.all(
        galleryImages.map((img) => uploadToCloudinary(img))
      );

      await addDoc(collection(db, "turfs"), {
        ownerId: user.uid,
        name,
        city,
        price: Number(price),
        description,
        sports,
        coverImage: coverUrl,
        galleryImages: galleryUrls,
        mapLink,
        createdAt: new Date(),
      });

      alert("Turf added successfully");

      // Reset
      setName("");
      setCity("");
      setPrice("");
      setDescription("");
      setSports([]);
      setMapLink("");
      setCoverImage(null);
      setCoverPreview(null);
      setGalleryImages([]);
      setGalleryPreviews([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Add New Turf
      </h1>

      <form
        onSubmit={handleAddTurf}
        className="bg-zinc-900 p-8 rounded-2xl space-y-8 text-white"
      >
        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Turf Name"
            required
            className="w-full p-3 bg-zinc-800 rounded-xl"
          />

          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-zinc-400" />
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
              className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
            />
          </div>
        </div>

        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 text-zinc-400" />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per hour"
            required
            className="w-full pl-10 p-3 bg-zinc-800 rounded-xl"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Turf description"
          rows="4"
          className="w-full p-3 bg-zinc-800 rounded-xl"
        />

        {/* SPORTS */}
        <div>
          <p className="mb-2 text-sm text-zinc-400">
            Sports Available
          </p>
          <div className="flex flex-wrap gap-3">
            {sportOptions.map((sport) => (
              <button
                type="button"
                key={sport}
                onClick={() => toggleSport(sport)}
                className={`px-4 py-2 rounded-full border ${
                  sports.includes(sport)
                    ? "bg-green-500 text-black"
                    : "border-zinc-700"
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* MAP */}
        <div>
          <p className="mb-2 text-sm text-zinc-400 flex items-center gap-2">
            <Map size={16} /> Google Maps Location
          </p>

          <input
            value={mapLink}
            onChange={(e) => setMapLink(e.target.value)}
            placeholder="Paste place name, address or lat,lng"
            className="w-full p-3 bg-zinc-800 rounded-xl"
          />

          {mapLink && (
            <iframe
              title="Map Preview"
              src={getEmbedMap()}
              className="w-full h-64 rounded-xl mt-4 border border-zinc-700"
              loading="lazy"
            />
          )}
        </div>

        {/* COVER */}
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverChange(e.target.files[0])}
          />

          {coverPreview && (
            <div className="relative w-40 mt-3">
              <img
                src={coverPreview}
                className="rounded-xl"
              />
              <button
                type="button"
                onClick={removeCover}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* GALLERY */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleGalleryChange(e.target.files)}
        />

        <div className="flex flex-wrap gap-3">
          {galleryPreviews.map((img, i) => (
            <div key={i} className="relative w-32">
              <img src={img} className="rounded-xl" />
              <button
                type="button"
                onClick={() => removeGalleryImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full bg-green-500 text-black py-3 rounded-xl flex justify-center gap-2 font-semibold"
        >
          <Upload />
          {loading ? "Uploading..." : "Add Turf"}
        </button>
      </form>
    </div>
  );
};

export default AddTurf;
