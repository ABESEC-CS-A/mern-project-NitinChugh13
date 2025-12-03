import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

// .env yahin par load karo
dotenv.config();

console.log("Cloudinary env check (startup):", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "present" : "missing",
});

// Ab config yahin ho jayegi, .env load hone ke baad
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  if (!filePath) {
    console.log("❌ No filePath passed to uploadOnCloudinary");
    return null;
  }

  try {
    console.log("📤 Uploading to Cloudinary:", filePath);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "urbancart-products",
    });

    console.log("✅ Cloudinary upload success:", result.secure_url);

    fs.unlink(filePath, (err) => {
      if (err) console.log("⚠️ Error deleting local file:", err.message);
    });

    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);

    fs.unlink(filePath, (err) => {
      if (err) console.log("⚠️ Error deleting local file in catch:", err.message);
    });

    throw error;
  }
};

export default uploadOnCloudinary;
