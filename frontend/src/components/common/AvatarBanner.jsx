import React from "react";

const AvatarBanner = ({ avatarPreview }) => {
  return (
    <div className="relative group">
      <img
        src={avatarPreview || ""}
        alt="Avatar"
        className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-[#1a1a1a] object-cover"
      />
    </div>
  );
};

export default AvatarBanner;
