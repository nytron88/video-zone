import { useDispatch, useSelector } from "react-redux";
import { uploadFile } from "../store/slices/uploadSlice";
import { useState } from "react";
import axios from "axios";

const useCloudinaryUpload = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.upload);

  const [uploadProgress, setUploadProgress] = useState(0);

  const startUpload = async ({
    file,
    folder,
    resourceType = "auto",
    metadata = {},
  }) => {
    try {
      const signedUrlResponse = await dispatch(
        uploadFile({ folder, resourceType, metadata: JSON.stringify(metadata) })
      ).unwrap();

      const { upload_url, api_key, timestamp, signature, context } =
        signedUrlResponse;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", api_key);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      if (context) {
        formData.append("context", context);
      }
      if (folder) {
        formData.append("folder", folder);
      }

      const uploadResponse = await axios.post(upload_url, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      return uploadResponse.data;
    } catch (err) {
      console.error("Upload error:", err);
      throw err;
    }
  };

  return { startUpload, data, loading, error, uploadProgress };
};

export default useCloudinaryUpload;
