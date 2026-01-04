export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "addturf"); // your preset
  formData.append("folder", "turfs");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dtyenjuta/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
