// frontend/lib/auth/better-auth-client.ts

// Real implementation connecting to the backend API

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Get API base URL from environment or default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

export const signUp = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Basic validation
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || 'Signup failed'
      };
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    // Basic validation
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || 'Login failed'
      };
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
};

export const signOut = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = localStorage.getItem('auth_token');

    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }

    // Clear token from localStorage
    localStorage.removeItem('auth_token');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local token even if API call fails
    localStorage.removeItem('auth_token');
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return null;
    }

    // Decode JWT token to get user info (without verification - backend will verify)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      localStorage.removeItem('auth_token');
      return null;
    }

    return {
      id: payload.userId || payload.sub,
      email: payload.email,
      name: payload.name || payload.email,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('auth_token');
    return null;
  }
};

// Function to get the stored token
export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Function to refresh token (placeholder for future implementation)
export const refreshToken = async (): Promise<boolean> => {
  // In a real app, this would call the auth server to refresh the token
  // For now, we'll just check if the token exists
  const token = localStorage.getItem('auth_token');
  return !!token;
};