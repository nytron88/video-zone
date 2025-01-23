import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  PictureInPicture,
} from "lucide-react";

function VideoPlayer({ videoFile, title }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const updateProgress = () => {
    if (videoRef.current && progressRef.current) {
      const progressPercent =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progressPercent);
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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuteState = !isMuted;
      setIsMuted(newMuteState);
      videoRef.current.muted = newMuteState;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        // Firefox
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        // Internet Explorer/Edge
        videoRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const togglePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
      setIsPictureInPicture(false);
    } else if (videoRef.current) {
      if (videoRef.current.requestPictureInPicture) {
        videoRef.current
          .requestPictureInPicture()
          .then(() => setIsPictureInPicture(true))
          .catch((error) => {
            console.error("Error entering Picture in Picture mode", error);
          });
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handlePictureInPictureChange = () => {
      setIsPictureInPicture(!!document.pictureInPictureElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    videoRef.current?.addEventListener(
      "enterpictureinpicture",
      handlePictureInPictureChange
    );
    videoRef.current?.addEventListener(
      "leavepictureinpicture",
      handlePictureInPictureChange
    );

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div className="relative bg-black w-full rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={videoFile}
        className="w-full h-auto"
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

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button onClick={togglePlayPause} className="hover:text-purple-400">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="hover:text-purple-400">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-600 appearance-none rounded-full"
              />
            </div>

            <div className="text-sm">
              {formatTime(videoRef.current?.currentTime)} /{" "}
              {formatTime(videoRef.current?.duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={togglePictureInPicture}
              className={`hover:text-purple-400 ${
                isPictureInPicture ? "text-purple-500" : ""
              }`}
            >
              <PictureInPicture size={20} />
            </button>

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
