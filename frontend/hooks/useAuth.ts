import { useState, useEffect } from 'react';
import { signIn, signUp, signOut, getCurrentUser, refreshToken } from '../lib/auth/better-auth-client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check auth status periodically to handle token expiration
  useEffect(() => {
    // Check if user is already authenticated on mount
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();

    // Set up interval to check for token expiration
    const intervalId = setInterval(async () => {
      const user = await getCurrentUser();
      if (!user) {
        // Token expired, update state
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    }, 60000); // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await signIn(email, password);
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Login failed');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return { success: false, error: (error as Error).message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await signUp(name, email, password);
      if (result.success && result.user) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true, user: result.user };
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return { success: false, error: (error as Error).message };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: (error as Error).message };
    }
  };

  // Function to manually refresh token if needed
  const checkAndRefreshToken = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    if (!user) {
      // Token expired, redirect to login would typically happen here
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
    return true;
  };

  return {
    ...authState,
    login,
    register,
    logout,
    checkAndRefreshToken,
  };
};

export default useAuth;