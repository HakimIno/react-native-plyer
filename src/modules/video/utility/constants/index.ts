export const DEFAULT_VIDEO_STATE = {
  VOLUME: 1.0,
  PLAYBACK_RATE: 1.0,
  SEEK_INTERVAL: 10, 
  PROGRESS_UPDATE_INTERVAL: 1000,
};

export const SUPPORTED_VIDEO_FORMATS = {
  EXTENSIONS: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp'],
  MIME_TYPES: [
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'video/webm',
    'video/x-m4v',
    'video/3gpp',
  ],
};

// Playback rates
export const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

// Player control icons (using Ionicons names)
export const PLAYER_ICONS = {
  PLAY: 'play',
  PAUSE: 'pause',
  STOP: 'stop',
  FAST_FORWARD: 'play-forward',
  FAST_REWIND: 'play-back',
  VOLUME_HIGH: 'volume-high',
  VOLUME_LOW: 'volume-low',
  VOLUME_MUTE: 'volume-mute',
  FULLSCREEN: 'expand',
  FULLSCREEN_EXIT: 'contract',
  SETTINGS: 'settings',
  SKIP_NEXT: 'play-skip-forward',
  SKIP_PREVIOUS: 'play-skip-back',
};

// Player themes
export const PLAYER_THEMES = {
  DARK: {
    backgroundColor: '#000000',
    controlsColor: '#FFFFFF',
    progressColor: '#FF0000',
    overlayColor: 'rgba(0, 0, 0, 0.7)',
  },
  LIGHT: {
    backgroundColor: '#FFFFFF',
    controlsColor: '#000000',
    progressColor: '#007AFF',
    overlayColor: 'rgba(255, 255, 255, 0.7)',
  },
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  VIDEO_LOAD_ERROR: 'Failed to load video. Please try again.',
  UNSUPPORTED_FORMAT: 'Unsupported video format.',
  FILE_NOT_FOUND: 'Video file not found.',
  PERMISSION_DENIED: 'Permission denied to access the video file.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

export const PLAYER_DIMENSIONS = {
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 400,
  ASPECT_RATIO: 16 / 9,
  CONTROL_BAR_HEIGHT: 50,
  PROGRESS_BAR_HEIGHT: 4,
};

export const ANIMATION_DURATIONS = {
  FADE_IN: 300,
  FADE_OUT: 300,
  SLIDE_IN: 250,
  SLIDE_OUT: 250,
  CONTROLS_AUTO_HIDE: 3000,
};

export const NETWORK_SETTINGS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
}; 