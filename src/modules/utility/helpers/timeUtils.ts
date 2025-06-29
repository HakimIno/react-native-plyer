/**
 * Format seconds to MM:SS or HH:MM:SS format
 */
export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // HH:MM:SS format
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return 0;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (currentTime: number, duration: number): number => {
  if (duration === 0) return 0;
  return Math.min((currentTime / duration) * 100, 100);
};

/**
 * Calculate time from progress percentage
 */
export const calculateTimeFromProgress = (progress: number, duration: number): number => {
  return (progress / 100) * duration;
};

/**
 * Check if time is valid
 */
export const isValidTime = (time: number): boolean => {
  return typeof time === 'number' && !isNaN(time) && time >= 0;
}; 