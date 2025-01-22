import React from "react";
import { getAllVideos } from "../../store/slices/videoSlice";
import { ContentDisplay, VideoCard } from "../index";

function VideoGrid({
  limit = 16,
  sortBy = "views",
  sortType = "desc",
  userId,
}) {
  const renderVideoCard = ({ item: video, onItemLoad }) => (
    <VideoCard
      key={video._id}
      video={video}
      onImageLoad={() => onItemLoad(video._id)}
    />
  );

  return (
    <ContentDisplay
      fetchAction={getAllVideos}
      renderItem={renderVideoCard}
      limit={limit}
      additionalParams={{ sortBy, sortType, userId, isPublished: true }}
      itemName="video"
    />
  );
}

export default VideoGrid;
