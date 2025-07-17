export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isBuffering: boolean;
  playbackRate: number;
  currentVideoUrl?: string;
  currentVideoTitle?: string;

}

export interface TextTrack {
  src: string;
  label: string;
  language: string;
  kind: string;
  type: string;
  default?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  isLocal: boolean;
  textTracks?: TextTrack[];
  isLive?: boolean;
}



export interface PlayerControls {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => void;
  setPlaybackRate: (rate: number) => void;
}

export type VideoAction =
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'SET_BUFFERING'; payload: boolean }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'SET_CURRENT_VIDEO'; payload: { url: string; title: string } }
  | { type: 'RESET_STATE' };

export interface VideoContextType {
  videoState: VideoState;
  playerControls: PlayerControls;
  videoList: VideoItem[];
  currentVideoIndex: number;
  setCurrentVideo: (video: VideoItem, index: number) => void;
  addToPlaylist: (video: VideoItem) => void;
  removeFromPlaylist: (id: string) => void;
  setVideoRef: (ref: any) => void;
  canUpdateProgress: () => boolean;
  dispatch: React.Dispatch<VideoAction>;
}

export type RootStackParamList = {
  Home: undefined;
  Player: undefined;
  AddVideo: undefined;
}; 