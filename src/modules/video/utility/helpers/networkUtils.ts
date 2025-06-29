
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


export const isLocalFile = (url: string): boolean => {
  return url.startsWith('file://') || url.startsWith('/') || url.startsWith('./');
};


export const getVideoType = (url: string): 'local' | 'online' | 'stream' => {
  if (isLocalFile(url)) {
    return 'local';
  }
  
  const streamingPatterns = [
    /youtube\.com/,
    /youtu\.be/,
    /vimeo\.com/,
    /dailymotion\.com/,
    /twitch\.tv/,
  ];
  
  if (streamingPatterns.some(pattern => pattern.test(url))) {
    return 'stream';
  }
  
  return 'online';
};


export const extractVideoId = (url: string): string | null => {
  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) return youtubeMatch[1];
  
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];
  
  return null;
};

/**
 * Check network connectivity
 */
export const checkNetworkConnectivity = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate video URL accessibility
 */
export const validateVideoAccess = async (url: string): Promise<{
  isAccessible: boolean;
  error?: string;
}> => {
  try {
    if (isLocalFile(url)) {
      // For local files, we can't easily check accessibility in React Native
      // This would need platform-specific implementation
      return { isAccessible: true };
    }
    
    const response = await fetch(url, { method: 'HEAD' });
    return { isAccessible: response.ok };
  } catch (error) {
    return { 
      isAccessible: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}; 