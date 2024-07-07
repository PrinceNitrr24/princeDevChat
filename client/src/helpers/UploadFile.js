const cloudinaryName = import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME;
const url = `https://api.cloudinary.com/v1_1/${cloudinaryName}/auto/upload`;
const UploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-file");

  try {
    const res = await fetch(url, {
      method: "post",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload file");
    }

    const resData = await res.json();
    return resData;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export default UploadFile;
