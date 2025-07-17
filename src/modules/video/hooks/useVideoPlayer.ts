import { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  setPlaying,
  setCurrentTime,
  forceSetCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  toggleFullscreen,
  setBuffering,
  setPlaybackRate,
  setCurrentVideo,
  setCurrentVideoIndex,
  addToPlaylist,
  removeFromPlaylist,
  setSeekingInProgress,
  setAvailableTextTracks,
  resetVideoState,
} from '../../../store/slices/videoSlice';
import { VideoItem } from '../../../types';


export const useVideoPlayer = () => {
  const dispatch = useAppDispatch();
  const videoState = useAppSelector((state) => state.video);
  const videoRef = useRef<any>(null);
  const isUserSeeking = useRef<boolean>(false);
  const pendingSeekTime = useRef<number | null>(null);

  const getCurrentVideo = () => {
    return videoState.videoList[videoState.currentVideoIndex] || null;
  };

  useEffect(() => {
    if (!videoRef.current) return;

    if (videoState.isPlaying) {
      videoRef.current.resume?.();
    } else {
      videoRef.current.pause?.();
    }
  }, [videoState.isPlaying]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.setVolume?.(videoState.isMuted ? 0 : videoState.volume);
  }, [videoState.volume, videoState.isMuted]);

  const setVideoRef = (ref: any) => {
    videoRef.current = ref;
  };

  const play = () => {
    dispatch(setPlaying(true));
  };

  const pause = () => {
    dispatch(setPlaying(false));
  };

  const togglePlayPause = () => {
    dispatch(setPlaying(!videoState.isPlaying));
  };

  const seek = (time: number) => {
    if (!videoRef.current || time < 0 || time > videoState.duration) {
      return;
    }

    const clampedTime = Math.max(0, Math.min(videoState.duration, time));

    isUserSeeking.current = true;
    pendingSeekTime.current = clampedTime;

    dispatch(setSeekingInProgress(true));

    dispatch(forceSetCurrentTime(clampedTime));

    try {
      videoRef.current.seek(clampedTime);
    } catch (error) {
      console.warn('Seek error:', error);
      isUserSeeking.current = false;
      pendingSeekTime.current = null;
      dispatch(setSeekingInProgress(false));
    }
  };

  const seekBackward = (seconds: number = 10) => {
    const newTime = Math.max(0, videoState.currentTime - seconds);
    seek(newTime);
  };

  const seekForward = (seconds: number = 10) => {
    const newTime = Math.min(videoState.duration, videoState.currentTime + seconds);
    seek(newTime);
  };

  const seekToPercentage = (percentage: number) => {
    if (videoState.duration > 0) {
      const seekTime = (percentage / 100) * videoState.duration;
      seek(seekTime);
    }
  };

  const changeVolume = (volume: number) => {
    dispatch(setVolume(Math.max(0, Math.min(1, volume))));
  };

  const mute = () => {
    dispatch(toggleMute());
  };

  const enterFullscreen = () => {
    dispatch(toggleFullscreen());
  };

  const changePlaybackRate = (rate: number) => {
    dispatch(setPlaybackRate(rate));
  };

  // Video management
  const loadVideo = (video: VideoItem, index?: number) => {
    dispatch(resetVideoState());
    isUserSeeking.current = false;
    pendingSeekTime.current = null;

    dispatch(setCurrentVideo({
      url: video.url,
      title: video.title,
      isLive: video.isLive || false,
    }));

    if (index !== undefined) {
      dispatch(setCurrentVideoIndex(index));
    }
  };

  const setCurrentVideoFn = (video: VideoItem, index?: number) => {
    dispatch(resetVideoState());
    isUserSeeking.current = false;
    pendingSeekTime.current = null;

    dispatch(setCurrentVideo({
      url: video.url,
      title: video.title,
      isLive: video.isLive || false,
    }));

    if (video.textTracks) {
      dispatch(setAvailableTextTracks(video.textTracks));
    }

    if (index !== undefined) {
      dispatch(setCurrentVideoIndex(index));
    }
  };

  const reset = () => {
    dispatch(resetVideoState());
    isUserSeeking.current = false;
    pendingSeekTime.current = null;
  };

  const handleProgress = (data: { currentTime: number; playableDuration?: number }) => {
    if (isUserSeeking.current || videoState.isSeekingInProgress) {
      return;
    }

    if (data.currentTime !== undefined) {
      dispatch(setCurrentTime(data.currentTime));
    }
  };

  const handleLoad = (data: { duration: number; naturalSize?: any; textTracks?: any[] }) => {
    if (data.duration && data.duration > 0) {
      dispatch(setDuration(data.duration));
    }

    dispatch(setBuffering(false));
    dispatch(setSeekingInProgress(false));
    isUserSeeking.current = false;
    pendingSeekTime.current = null;
  };

  const handleBuffer = (meta: { isBuffering: boolean }) => {
    dispatch(setBuffering(meta.isBuffering));
  };

  const handleLoadStart = () => {
    dispatch(setBuffering(true));
  };

  const handleEnd = () => {
    dispatch(setPlaying(false));
    dispatch(setCurrentTime(videoState.duration));
    isUserSeeking.current = false;
    pendingSeekTime.current = null;
  };

  const handleSeek = (data: { currentTime: number; seekTime: number }) => {
    dispatch(setSeekingInProgress(false));

    if (data.currentTime !== undefined) {
      dispatch(setCurrentTime(data.currentTime));
    }

    isUserSeeking.current = false;
    pendingSeekTime.current = null;
  };

  const handleFullscreenChange = () => {
    dispatch(toggleFullscreen());
  };

  const handleTextTracks = (data: { textTracks: any[] }) => {
  };

  return {
    videoState,

    setVideoRef,

    // Playback controls
    play,
    pause,
    togglePlayPause,
    seek,
    seekBackward,
    seekForward,
    seekToPercentage,
    changeVolume,
    toggleMute: mute,
    toggleFullscreen: enterFullscreen,
    changePlaybackRate,

    // Video management
    loadVideo,
    setCurrentVideo: setCurrentVideoFn,
    getCurrentVideo,
    reset,

    // Event handlers
    handleProgress,
    handleLoad,
    handleBuffer,
    handleLoadStart,
    handleEnd,
    handleSeek,
    handleTextTracks,
    handleFullscreenChange,
  };
};

/**
 * Hook for managing video playlist functionality
 */
export const useVideoPlaylist = () => {
  const dispatch = useAppDispatch();
  const { videoList, currentVideoIndex } = useAppSelector((state) => state.video);

  const addVideo = (video: VideoItem) => {
    dispatch(addToPlaylist(video));
  };

  const addToPlaylistFn = (video: VideoItem) => {
    dispatch(addToPlaylist(video));
  };

  const removeVideo = (id: string) => {
    dispatch(removeFromPlaylist(id));
  };

  const getCurrentVideo = () => {
    return videoList[currentVideoIndex] || null;
  };

  const hasNext = () => {
    return currentVideoIndex < videoList.length - 1;
  };

  const hasPrevious = () => {
    return currentVideoIndex > 0;
  };

  const nextVideo = () => {
    if (hasNext()) {
      const nextIndex = currentVideoIndex + 1;
      const nextVid = videoList[nextIndex];
      if (nextVid) {
        dispatch(setCurrentVideo({ url: nextVid.url, title: nextVid.title, isLive: nextVid.isLive || false }));
        dispatch(setCurrentVideoIndex(nextIndex));
      }
    }
  };

  const previousVideo = () => {
    if (hasPrevious()) {
      const prevIndex = currentVideoIndex - 1;
      const prevVid = videoList[prevIndex];
      if (prevVid) {
        dispatch(setCurrentVideo({ url: prevVid.url, title: prevVid.title, isLive: prevVid.isLive || false }));
        dispatch(setCurrentVideoIndex(prevIndex));
      }
    }
  };

  return {
    videoList,
    currentVideoIndex,
    addVideo,
    addToPlaylist: addToPlaylistFn,
    removeVideo,
    getCurrentVideo,
    hasNext,
    hasPrevious,
    nextVideo,
    previousVideo,
  };
}; 