import React from "react";
import { getLikedVideos } from "../../../store/slices/likeSlice";
import VideoCard from "../../ContentDisplay/VideoCard";
import ContentDisplay from "../../ContentDisplay/ContentDisplay";

function LikedVideos({ limit = 16, sortBy = "views", sortType = "desc" }) {
  const renderVideoCard = ({ item: video, onItemLoad }) => (
    <VideoCard
      key={video._id}
      video={video}
      onImageLoad={() => onItemLoad(video._id)}
    />
  );

  return (
    <ContentDisplay
      fetchAction={getLikedVideos}
      renderItem={renderVideoCard}
      limit={limit}
      sortBy={sortBy}
      sortType={sortType}
      itemName="video"
    />
  );
}

export default LikedVideos;
