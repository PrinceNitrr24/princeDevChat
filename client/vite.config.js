import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Define each environment variable separately
    "process.env.VITE_APP_CLOUDINARY_CLOUD_NAME": JSON.stringify(
      process.env.VITE_APP_CLOUDINARY_CLOUD_NAME
    ),
    "process.env.VITE_APP_BACKEND_URL": JSON.stringify(
      process.env.VITE_APP_BACKEND_URL
    ),
  },
  assetsInclude: ["**/*.PNG"],
});
