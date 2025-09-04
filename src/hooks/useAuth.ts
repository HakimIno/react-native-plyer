import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    rememberMe,
    emailExists,
    isCheckingEmail,
    currentEmail,
    login,
    logout,
    register,
    checkEmailExists,
    resetEmailFlow,
    setError,
    setRememberMe,
    initializeAuth,
    updateUserProfile,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    rememberMe,
    emailExists,
    isCheckingEmail,
    currentEmail,
    
    // Actions
    login,
    logout,
    register,
    checkEmailExists,
    resetEmailFlow,
    setError,
    setRememberMe,
    updateUserProfile,
  };
};

// Separate hook for form management
export const useAuthForm = () => {
  const { login, register, checkEmailExists, resetEmailFlow, setError } = useAuth();

  const handleLogin = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      await login(email, password, rememberMe);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleCheckEmail = async (email: string) => {
    try {
      return await checkEmailExists(email);
    } catch (error) {
      return false;
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleCheckEmail,
    resetEmailFlow,
    setError,
  };
};
