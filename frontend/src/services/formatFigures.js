/**
 * Converts an ISO 8601 timestamp into a readable date/time format.
 * @param {string} isoString - The ISO 8601 timestamp to format.
 * @param {Object} options - Formatting options for date and time.
 * @returns {string} Formatted date/time string.
 */
export const formatDate = (isoString, options = { date: true, time: true }) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  const formattedDate = options.date
    ? date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const formattedTime = options.time
    ? date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return `${formattedDate}${
    options.date && options.time ? " " : ""
  }${formattedTime}`;
};
