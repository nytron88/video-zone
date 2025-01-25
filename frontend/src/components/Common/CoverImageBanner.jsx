import React from "react";

const CoverImageBanner = ({ coverPreview }) => {
  return (
    <div className="relative w-full h-40 sm:h-52 bg-[#1a1a1a] rounded-xl mb-4 sm:mb-8 overflow-hidden group">
      <img
        src={coverPreview || ""}
        alt="Cover"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default CoverImageBanner;
