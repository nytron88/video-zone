import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getVideoById } from "../../store/slices/videoSlice";
import CommentList from "./CommentList";
import VideoDetails from "./VideoDetails";
import VideoPlayer from "./VideoPlayer";
import { Loader } from "../index";

function VideoDisplay() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasIncrementedView = useRef(false);
  const dispatch = useDispatch();

  const fetchVideo = async (incrementView = false) => {
    try {
      const response = await dispatch(
        getVideoById({
          videoId,
          incrementView,
        })
      ).unwrap();
      setVideo(response);
    } catch (err) {
      console.error("Failed to fetch video:", err);
      setError("Unable to load video. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchVideo(false);
  }, [videoId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasIncrementedView.current) {
        fetchVideo(true);
        hasIncrementedView.current = true;
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [videoId]);

  if (isLoading) return <Loader />;

  if (!video || error) {
    return <div className="text-white">Video not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <VideoPlayer videoFile={video.videoFile} title={video.title} />
      <VideoDetails video={video} />
      <CommentList videoId={videoId} />
    </div>
  );
}

export default VideoDisplay;
