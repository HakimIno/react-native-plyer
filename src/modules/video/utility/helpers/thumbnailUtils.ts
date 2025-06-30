import * as VideoThumbnails from 'expo-video-thumbnails';

interface ThumbnailOptions {
  time?: number; 
  quality?: number; 
}

export const generateVideoThumbnail = async (
  videoUrl: string,
  options: ThumbnailOptions = {}
): Promise<string | null> => {
  try {
    const { time = 1000, quality = 1 } = options;

    const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
      time,
      quality,
    });

    return uri;
  } catch (error) {
    console.log('Error generating thumbnail:', error);
    return null;
  }
};

export const getVideoThumbnail = async (
  videoUrl: string,
  existingThumbnail?: string,
  options: ThumbnailOptions = {}
): Promise<string> => {
  if (existingThumbnail && existingThumbnail !== '') {
    return existingThumbnail;
  }

  const generatedThumbnail = await generateVideoThumbnail(videoUrl, options);
  
  return generatedThumbnail || 'https://via.placeholder.com/320x180?text=Video';
};


const thumbnailCache = new Map<string, string>();

export const getCachedVideoThumbnail = async (
  videoUrl: string,
  existingThumbnail?: string,
  options: ThumbnailOptions = {}
): Promise<string> => {
  if (existingThumbnail && existingThumbnail !== '') {
    return existingThumbnail;
  }

  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl)!;
  }

  const generatedThumbnail = await generateVideoThumbnail(videoUrl, options);
  const finalThumbnail = generatedThumbnail || 'https://via.placeholder.com/320x180?text=Video';
  
  thumbnailCache.set(videoUrl, finalThumbnail);
  
  return finalThumbnail;
}; 