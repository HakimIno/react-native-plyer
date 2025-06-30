
export const isValidVideoUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
    const pathname = urlObj.pathname.toLowerCase();
    

    if (validExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }
    

    const streamingPatterns = [
      /youtube\.com\/watch/,
      /youtu\.be\//,
      /vimeo\.com/,
      /dailymotion\.com/,
      /twitch\.tv/,
    ];
    
    return streamingPatterns.some(pattern => pattern.test(url));
  } catch {
    return false;
  }
};

