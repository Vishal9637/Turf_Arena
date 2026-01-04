import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Upload, MapPin, IndianRupee, X } from "lucide-react";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const AddTurf = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [sports, setSports] = useState([]);

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
      alert("Cover image required");
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
        createdAt: new Date(),
      });

      alert("Turf added successfully");

      setName("");
      setCity("");
      setPrice("");
      setDescription("");
      setSports([]);
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
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Turf</h1>

      <form
        onSubmit={handleAddTurf}
        className="bg-white p-8 rounded-2xl shadow space-y-6"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Turf Name"
          required
          className="w-full p-3 border rounded-xl"
        />

        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            required
            className="w-full pl-10 p-3 border rounded-xl"
          />
        </div>

        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 text-gray-400" />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per hour"
            required
            className="w-full pl-10 p-3 border rounded-xl"
          />
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows="4"
          className="w-full p-3 border rounded-xl"
        />

        <div className="flex flex-wrap gap-3">
          {sportOptions.map((sport) => (
            <button
              type="button"
              key={sport}
              onClick={() => toggleSport(sport)}
              className={`px-4 py-2 rounded-full border ${
                sports.includes(sport)
                  ? "bg-green-500 text-white"
                  : ""
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Cover Image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleCoverChange(e.target.files[0])}
        />

        {coverPreview && (
          <div className="relative w-40">
            <img src={coverPreview} className="rounded-xl" />
            <button
              type="button"
              onClick={removeCover}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Gallery */}
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
          className="w-full bg-green-500 text-white py-3 rounded-xl flex justify-center gap-2"
        >
          <Upload />
          {loading ? "Uploading..." : "Add Turf"}
        </button>
      </form>
    </div>
  );
};

export default AddTurf;
