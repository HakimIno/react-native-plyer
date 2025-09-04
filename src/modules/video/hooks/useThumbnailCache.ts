import { useState, useEffect, useCallback } from 'react';
import { getCachedVideoThumbnail } from '../utility/helpers/thumbnailUtils';
import { VideoItem } from '../../../types';

export const useThumbnailCache = (videoList: VideoItem[]) => {
  const [thumbnailCache, setThumbnailCache] = useState<Map<string, string>>(new Map());
  const [loadingThumbnails, setLoadingThumbnails] = useState<Set<string>>(new Set());

  const loadThumbnail = useCallback(async (video: VideoItem) => {
    if (loadingThumbnails.has(video.id) || thumbnailCache.has(video.id)) {
      return;
    }

    const shouldGenerateThumbnail = !video.thumbnail ||
      video.thumbnail.includes('placeholder') ||
      video.thumbnail.includes('via.placeholder.com') ||
      video.thumbnail === '';

    if (!shouldGenerateThumbnail) {
      return;
    }

    setLoadingThumbnails(prev => new Set(prev).add(video.id));

    try {
      const generatedThumbnail = await getCachedVideoThumbnail(
        video.url,
        video.thumbnail,
        { time: 2000, quality: 0.7 }
      );

      if (generatedThumbnail) {
        setThumbnailCache(prev => {
          const newCache = new Map(prev);
          newCache.set(video.id, generatedThumbnail);
          return newCache;
        });
      }
    } catch (error) {
      console.log('Error generating thumbnail for video:', video.title, error);
    } finally {
      setLoadingThumbnails(prev => {
        const newSet = new Set(prev);
        newSet.delete(video.id);
        return newSet;
      });
    }
  }, [thumbnailCache, loadingThumbnails]);

  const loadThumbnailsForVideos = useCallback(async () => {
    const videosNeedingThumbnails = videoList.filter((video: VideoItem) => {
      const shouldGenerateThumbnail = !video.thumbnail ||
        video.thumbnail.includes('placeholder') ||
        video.thumbnail.includes('via.placeholder.com') ||
        video.thumbnail === '';

      return shouldGenerateThumbnail && 
             !thumbnailCache.has(video.id) && 
             !loadingThumbnails.has(video.id);
    });

    // Load thumbnails in batches to avoid overwhelming the system
    const batchSize = 2;
    for (let i = 0; i < videosNeedingThumbnails.length; i += batchSize) {
      const batch = videosNeedingThumbnails.slice(i, i + batchSize);
      await Promise.all(batch.map(video => loadThumbnail(video)));
      
      // Small delay between batches
      if (i + batchSize < videosNeedingThumbnails.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [videoList, thumbnailCache, loadingThumbnails, loadThumbnail]);

  useEffect(() => {
    if (videoList.length > 0) {
      loadThumbnailsForVideos();
    }
  }, [videoList, loadThumbnailsForVideos]);

  const getThumbnail = useCallback((videoId: string, fallbackThumbnail?: string) => {
    return thumbnailCache.get(videoId) || fallbackThumbnail || '';
  }, [thumbnailCache]);

  const isThumbnailLoading = useCallback((videoId: string) => {
    return loadingThumbnails.has(videoId);
  }, [loadingThumbnails]);

  return {
    thumbnailCache,
    getThumbnail,
    isThumbnailLoading,
    loadThumbnail,
  };
};
