import { MMKV } from 'react-native-mmkv';

// Create MMKV instance with encryption
export const storage = new MMKV({
  id: 'auth-storage',
  encryptionKey: 'your-encryption-key-here', // ใน production ควรใช้ key ที่ปลอดภัยกว่า
});

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me',
} as const;

// Token management
export const tokenStorage = {
  // Save authentication token
  setToken: (token: string) => {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  // Get authentication token
  getToken: (): string | null => {
    return storage.getString(STORAGE_KEYS.AUTH_TOKEN) || null;
  },

  // Save refresh token
  setRefreshToken: (refreshToken: string) => {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    return storage.getString(STORAGE_KEYS.REFRESH_TOKEN) || null;
  },

  // Clear all tokens
  clearTokens: () => {
    storage.delete(STORAGE_KEYS.AUTH_TOKEN);
    storage.delete(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

// User data management
export const userStorage = {
  // Save user data
  setUser: (user: any) => {
    storage.set(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  // Get user data
  getUser: (): any | null => {
    const userData = storage.getString(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  // Clear user data
  clearUser: () => {
    storage.delete(STORAGE_KEYS.USER_DATA);
  },
};

// Remember me functionality
export const rememberMeStorage = {
  // Save remember me preference
  setRememberMe: (remember: boolean) => {
    storage.set(STORAGE_KEYS.REMEMBER_ME, remember);
  },

  // Get remember me preference
  getRememberMe: (): boolean => {
    return storage.getBoolean(STORAGE_KEYS.REMEMBER_ME) || false;
  },
};

// Clear all authentication data
export const clearAuthData = () => {
  tokenStorage.clearTokens();
  userStorage.clearUser();
  rememberMeStorage.setRememberMe(false);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return tokenStorage.getToken() !== null;
};

// Get stored authentication data
export const getStoredAuthData = () => {
  return {
    token: tokenStorage.getToken(),
    refreshToken: tokenStorage.getRefreshToken(),
    user: userStorage.getUser(),
    rememberMe: rememberMeStorage.getRememberMe(),
  };
};
