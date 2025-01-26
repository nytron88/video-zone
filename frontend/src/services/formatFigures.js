/**
 * Converts an ISO 8601 timestamp into a readable date/time format.
 * @param {string} isoString - The ISO 8601 timestamp to format.
 * @param {Object} options - Formatting options for date and time.
 * @returns {string} Formatted date/time string.
 */

export const formatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Converts a time in seconds to a YouTube-style time format.
 * @param {number} seconds - The time in seconds to format.
 * @returns {string} Formatted time string.
 */
export const formatYouTubeTime = (seconds) => {
  if (typeof seconds !== "number" || seconds < 0) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedHours = hours > 0 ? `${hours}:` : "";
  const formattedMinutes =
    hours > 0 ? String(minutes).padStart(2, "0") : minutes;
  const formattedSeconds = String(secs).padStart(2, "0");

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
};
