const formatMS = (milliseconds: number) => {
  const seconds = milliseconds / 1000;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = hours.toString();
  const formattedMinutes = minutes.toString();
  const formattedSeconds = remainingSeconds.toFixed(1);

  const formatted = [
    hours > 0 ? `${formattedHours}h` : null,
    minutes > 0 ? `${formattedMinutes}m` : null,
    `${formattedSeconds}s`].filter(Boolean).join(' ');

  return formatted;
};

export default formatMS;