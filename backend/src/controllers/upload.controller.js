import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  cloudinaryStorageFolders,
  allowedImageMimeTypes,
  allowedVideoMimeTypes,
} from "../constants.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = asyncHandler(async (req, res) => {
  const { folder, resourceType = "auto", metadata } = req.query;

  if (!folder || !resourceType) {
    throw new ApiError(400, "Folder is required");
  }

  if (!cloudinaryStorageFolders.includes(folder)) {
    throw new ApiError(400, "Invalid folder");
  }

  let parsedMetadata = {};
  let context = null;

  if (metadata) {
    try {
      parsedMetadata = JSON.parse(metadata);

      if (parsedMetadata.size && parsedMetadata.size > 100 * 1024 * 1024) {
        throw new ApiError(400, "File size exceeds 100 MB");
      }

      if (
        resourceType === "image" &&
        !allowedImageMimeTypes.includes(parsedMetadata.type)
      ) {
        throw new ApiError(400, "Invalid image file type");
      }
      if (
        resourceType === "video" &&
        !allowedVideoMimeTypes.includes(parsedMetadata.type)
      ) {
        throw new ApiError(400, "Invalid video file type");
      }

      if (Object.keys(parsedMetadata).length > 0) {
        context = Object.entries(parsedMetadata)
          .map(([k, v]) => `${k}=${v}`)
          .join("|");
      }
    } catch (err) {
      throw new ApiError(400, "Invalid metadata format. Must be JSON.");
    }
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    let stringToSign = `timestamp=${timestamp}`;
    if (context) {
      stringToSign = `context=${context}&` + stringToSign;
    }

    const signature = cloudinary.utils.api_sign_request(
      {
        context,
        folder,
        timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return res.json(
      new ApiResponse(
        200,
        {
          upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
          api_key: process.env.CLOUDINARY_API_KEY,
          timestamp,
          signature,
          context,
          folder,
        },
        "Signature generated successfully"
      )
    );
  } catch (error) {
    throw new ApiError(500, "Failed to generate signed URL");
  }
});

export { upload };
