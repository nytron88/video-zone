import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
} from "lucide-react";

function VideoPlayer({
  videoFile,
  title,
  autoPlay = true,
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
}) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = (e) => {
    if (e.target === videoRef.current) {
      togglePlayPause();
    }
  };

  const updateProgress = () => {
    if (videoRef.current) {
      const progressPercent =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressPercent);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const seekVideo = (e) => {
    if (videoRef.current && progressRef.current) {
      const progressWidth = progressRef.current.clientWidth;
      const clickedPosition = e.nativeEvent.offsetX;
      const percentage = (clickedPosition / progressWidth) * 100;
      const time = (percentage / 100) * videoRef.current.duration;

      videoRef.current.currentTime = time;
      setProgress(percentage);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const handleVolumeChange = (newVolume) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!document.fullscreenElement) {
      videoElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      if (autoPlay) {
        videoElement
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.warn);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    videoElement?.addEventListener("loadedmetadata", handleLoadedMetadata);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      videoElement?.removeEventListener("loadedmetadata", handleLoadedMetadata);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [autoPlay]);

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="relative bg-black w-full rounded-xl overflow-hidden group"
      onClick={(e) => e.stopPropagation()}
    >
      <video
        ref={videoRef}
        src={videoFile}
        className="w-full h-auto cursor-pointer"
        onClick={handleVideoClick}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
        controlsList="nodownload"
      />

      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent 
        p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div
          ref={progressRef}
          onClick={seekVideo}
          className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-2"
        >
          <div
            className="h-full bg-purple-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-white relative">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlayPause} className="hover:text-purple-400">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleVolumeChange(isMuted ? volume : 0)}
                className="hover:text-purple-400"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-24 h-1 bg-gray-600 appearance-none rounded-full"
              />
            </div>

            <div className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4 relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="hover:text-purple-400"
            >
              <Settings size={20} />
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 bg-black/80 rounded p-2 space-y-1">
                {playbackRates.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`block w-full text-left px-2 py-1 ${
                      playbackRate === rate
                        ? "bg-purple-500"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={toggleFullscreen}
              className="hover:text-purple-400"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
