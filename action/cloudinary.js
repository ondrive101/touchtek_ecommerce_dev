"use server";
import { createNewSku_Inventory } from "@/config/main.config.js";
import { ifError } from "assert";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// Utility function to upload an image to Cloudinary with options
export async function uploadImage(file, options = {}) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      return reject(new Error("Provided file is not valid"));
    }

    // Convert file to buffer
    file.arrayBuffer()
      .then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);

        // Merge options with default settings (you can define any defaults here)
        const uploadOptions = {
          folder: options.folder || "default_folder",  // Default folder
          transformation: options.transformation || [], // Default transformations (if any)
          ...options,  // Override with user-provided options
        };

        // Upload to Cloudinary
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(new Error("Error uploading image to Cloudinary: " + error.message));
          } else {
            resolve(result); // Resolve with Cloudinary result
          }
        });

        // Pipe the file buffer into the Cloudinary upload stream
        streamifier.createReadStream(buffer).pipe(stream);
      })
      .catch((error) => reject(new Error("Error processing file buffer: " + error.message)));
  });
}