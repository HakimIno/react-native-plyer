import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoItem, TextTrack } from '../../types';

export interface VideoState {
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  isSeekingInProgress: boolean;

  // Current video
  currentVideoUrl: string;
  currentVideoTitle: string;
  isLive: boolean;
  // Subtitle state
  selectedTextTrack: {
    type: 'system' | 'disabled' | 'index' | 'language' | 'title';
    value?: string | number;
  };
  availableTextTracks: TextTrack[];

  // Playlist
  videoList: VideoItem[];
  currentVideoIndex: number;
}

const initialState: VideoState = {
  // Playback state
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isBuffering: false,
  isFullscreen: false,
  playbackRate: 1,
  isSeekingInProgress: false,

  // Current video
  currentVideoUrl: '',
  currentVideoTitle: '',
  isLive: false,

  // Subtitle state
  selectedTextTrack: { type: 'index', value: 0 }, // Default to first subtitle track
  availableTextTracks: [],

  // Playlist
  videoList: [],
  currentVideoIndex: 0,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setCurrentTime: (state, action: PayloadAction<number>) => {
      if (!state.isSeekingInProgress) {
        state.currentTime = action.payload;
      }
    },

    forceSetCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload));
    },

    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },

    setBuffering: (state, action: PayloadAction<boolean>) => {
      state.isBuffering = action.payload;
    },

    toggleFullscreen: (state) => {
      state.isFullscreen = !state.isFullscreen;
    },

    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },

    setSeekingInProgress: (state, action: PayloadAction<boolean>) => {
      state.isSeekingInProgress = action.payload;
    },

    setSelectedTextTrack: (state, action: PayloadAction<{ type: 'system' | 'disabled' | 'index' | 'language' | 'title'; value?: string | number }>) => {
      state.selectedTextTrack = action.payload;
    },

    setAvailableTextTracks: (state, action: PayloadAction<TextTrack[]>) => {
      state.availableTextTracks = action.payload;
    },

    setCurrentVideo: (state, action: PayloadAction<{ url: string; title: string; isLive: boolean }>) => {
      state.currentVideoUrl = action.payload.url;
      state.currentVideoTitle = action.payload.title;
      state.isLive = action.payload.isLive;
      // Reset playback state for new video
      state.currentTime = 0;
      state.duration = 0;
      state.isPlaying = false;
      state.isBuffering = true;
      // Reset subtitle tracks for new video
      state.availableTextTracks = [];
      state.selectedTextTrack = { type: 'index', value: 0 }; // Default to first track
    },

    setCurrentVideoIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.videoList.length) {
        state.currentVideoIndex = action.payload;
      }
    },

    addToPlaylist: (state, action: PayloadAction<VideoItem>) => {
      const exists = state.videoList.some(video => video.id === action.payload.id);
      if (!exists) {
        state.videoList.push(action.payload);
      }
    },

    removeFromPlaylist: (state, action: PayloadAction<string>) => {
      const index = state.videoList.findIndex(video => video.id === action.payload);
      if (index !== -1) {
        state.videoList.splice(index, 1);
        // Adjust current index if necessary
        if (state.currentVideoIndex >= index && state.currentVideoIndex > 0) {
          state.currentVideoIndex--;
        }
      }
    },

    resetVideoState: (state) => {
      return { ...initialState, videoList: state.videoList };
    },
  },
});

export const {
  setPlaying,
  setCurrentTime,
  forceSetCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  setBuffering,
  toggleFullscreen,
  setPlaybackRate,
  setSeekingInProgress,
  setSelectedTextTrack,
  setAvailableTextTracks,
  setCurrentVideo,
  setCurrentVideoIndex,
  addToPlaylist,
  removeFromPlaylist,
  resetVideoState,
} = videoSlice.actions;

export default videoSlice.reducer; 