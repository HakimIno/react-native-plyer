import { create } from 'zustand';
import { tokenStorage, userStorage, rememberMeStorage, clearAuthData } from '../services/storage';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;
  // New states for email verification flow
  emailExists: boolean | null;
  isCheckingEmail: boolean;
  currentEmail: string;
}

export interface AuthActions {
  // Authentication actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  
  // Email verification flow
  checkEmailExists: (email: string) => Promise<boolean>;
  resetEmailFlow: () => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRememberMe: (remember: boolean) => void;
  
  // Initialize auth from storage
  initializeAuth: () => void;
  
  // Update user profile
  updateUserProfile: (updates: Partial<User>) => void;
}

export type AuthStore = AuthState & AuthActions;

// Mock API functions (replace with real API calls)
const mockCheckEmailExists = async (email: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock existing emails - in real app, this would call your backend
  const existingEmails = ['user@example.com', 'test@test.com', 'admin@admin.com'];
  return existingEmails.includes(email.toLowerCase());
};

const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation
  if (email === 'user@example.com' && password === 'password') {
    return {
      user: {
        id: '1',
        email,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  }
  
  throw new Error('รหัสผ่านไม่ถูกต้อง');
};

const mockRegister = async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    user: {
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
    },
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false,
  emailExists: null,
  isCheckingEmail: false,
  currentEmail: '',

  // Actions
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  setUser: (user: User | null) => set({ user }),
  
  setToken: (token: string | null) => set({ token }),
  
  setRememberMe: (remember: boolean) => {
    set({ rememberMe: remember });
    rememberMeStorage.setRememberMe(remember);
  },

  checkEmailExists: async (email: string) => {
    set({ isCheckingEmail: true, error: null, currentEmail: email });
    
    try {
      const exists = await mockCheckEmailExists(email);
      set({ 
        emailExists: exists, 
        isCheckingEmail: false,
        currentEmail: email 
      });
      return exists;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล',
        isCheckingEmail: false,
        emailExists: null,
      });
      return false;
    }
  },

  resetEmailFlow: () => {
    set({
      emailExists: null,
      isCheckingEmail: false,
      currentEmail: '',
      error: null,
    });
  },

  login: async (email: string, password: string, rememberMe = false) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, token } = await mockLogin(email, password);
      
      // Store in MMKV if remember me is checked
      if (rememberMe) {
        tokenStorage.setToken(token);
        userStorage.setUser(user);
        rememberMeStorage.setRememberMe(true);
      } else {
        // Clear any existing stored data if not remembering
        clearAuthData();
      }
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'เข้าสู่ระบบไม่สำเร็จ',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user, token } = await mockRegister(name, email, password);
      
      // Always store registration data
      tokenStorage.setToken(token);
      userStorage.setUser(user);
      rememberMeStorage.setRememberMe(true);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe: true,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'สมัครสมาชิกไม่สำเร็จ',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  logout: () => {
    clearAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      rememberMe: false,
      emailExists: null,
      isCheckingEmail: false,
      currentEmail: '',
    });
  },

  initializeAuth: () => {
    const storedToken = tokenStorage.getToken();
    const storedUser = userStorage.getUser();
    const storedRememberMe = rememberMeStorage.getRememberMe();
    
    if (storedToken && storedUser && storedRememberMe) {
      set({
        user: storedUser,
        token: storedToken,
        isAuthenticated: true,
        rememberMe: storedRememberMe,
      });
    }
  },

  updateUserProfile: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      userStorage.setUser(updatedUser);
      set({ user: updatedUser });
    }
  },
}));
