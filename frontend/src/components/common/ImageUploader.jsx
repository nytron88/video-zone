import React, { useState } from "react";

const ImageUploader = ({ label, id, onFileChange }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (onFileChange) onFileChange(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    document.getElementById(id).value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id={id}
          onChange={handleFileChange}
        />
        <label
          htmlFor={id}
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-100 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 hover:text-white focus:outline-none focus:ring focus:ring-cyan-500"
        >
          Choose File
        </label>
      </div>
      {preview && (
        <div className="relative mt-4">
          <img
            src={preview}
            alt={`${label} Preview`}
            className="w-full h-32 object-cover rounded-lg border border-gray-700"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
