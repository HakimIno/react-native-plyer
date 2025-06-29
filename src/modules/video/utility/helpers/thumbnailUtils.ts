import * as VideoThumbnails from 'expo-video-thumbnails';

interface ThumbnailOptions {
  time?: number; // Time in milliseconds to capture thumbnail (default: 1000ms)
  quality?: number; // Quality from 0 to 1 (default: 1)
}

/**
 * Generate thumbnail from video URL
 * @param videoUrl - The URL of the video
 * @param options - Thumbnail generation options
 * @returns Promise<string | null> - Returns the local URI of the generated thumbnail or null if failed
 */
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

/**
 * Get thumbnail for video - either use existing thumbnail or generate one
 * @param videoUrl - The URL of the video
 * @param existingThumbnail - Existing thumbnail URL (if any)
 * @param options - Thumbnail generation options
 * @returns Promise<string> - Returns thumbnail URL (existing or generated)
 */
export const getVideoThumbnail = async (
  videoUrl: string,
  existingThumbnail?: string,
  options: ThumbnailOptions = {}
): Promise<string> => {
  // If we already have a thumbnail, use it
  if (existingThumbnail && existingThumbnail !== '') {
    return existingThumbnail;
  }

  // Try to generate thumbnail from video
  const generatedThumbnail = await generateVideoThumbnail(videoUrl, options);
  
  // Return generated thumbnail or fallback to placeholder
  return generatedThumbnail || 'https://via.placeholder.com/320x180?text=Video';
};

/**
 * Cache for generated thumbnails to avoid regenerating
 */
const thumbnailCache = new Map<string, string>();

/**
 * Get cached thumbnail or generate new one
 * @param videoUrl - The URL of the video
 * @param existingThumbnail - Existing thumbnail URL (if any)
 * @param options - Thumbnail generation options
 * @returns Promise<string> - Returns thumbnail URL
 */
export const getCachedVideoThumbnail = async (
  videoUrl: string,
  existingThumbnail?: string,
  options: ThumbnailOptions = {}
): Promise<string> => {
  // If we already have a thumbnail, use it
  if (existingThumbnail && existingThumbnail !== '') {
    return existingThumbnail;
  }

  // Check cache first
  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl)!;
  }

  // Generate new thumbnail
  const generatedThumbnail = await generateVideoThumbnail(videoUrl, options);
  const finalThumbnail = generatedThumbnail || 'https://via.placeholder.com/320x180?text=Video';
  
  // Cache the result
  thumbnailCache.set(videoUrl, finalThumbnail);
  
  return finalThumbnail;
}; 