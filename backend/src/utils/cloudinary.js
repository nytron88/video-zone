import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (resource, folder) => {
  try {
    const base64String = `data:image/png;base64,${resource.toString("base64")}`;
    const response = await cloudinary.uploader.upload(base64String, {
      resource_type: "auto",
      folder: folder?.trim() || "default",
    });
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    return null;
  }
};

const deleteFromCloudinary = async (url, folder, resourceType = "image") => {
  try {
    const fileName = url.match(/\/([^/]+)\.[a-z]+(\?|$)/)?.[1];

    const resourcePublicId = folder ? `${folder}/${fileName}` : fileName;

    const response = await cloudinary.uploader.destroy(resourcePublicId, {
      resource_type: resourceType,
    });

    return response;
  } catch (error) {
    console.error("Cloudinary delete error:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
