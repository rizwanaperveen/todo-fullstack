import { AuthResponse, TodoApiResponse } from '@/types/api';
import { User } from '@/types/user';

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';
    this.token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

 const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('auth_token')
      : null;

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle 204 No Content responses (like DELETE)
      if (response.status === 204) {
        return null;
      }

      // Only try to parse JSON if there's content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<{ success: boolean; message?: string }> {
    const response = await this.request('/api/auth/logout', {
      method: 'POST',
    });

    this.clearToken();
    return response;
  }

  // Generic HTTP methods
  async get(endpoint: string) {
    return await this.request(endpoint, {
      method: 'GET',
    });
  }

  async post(endpoint: string, data?: any) {
    return await this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return await this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return await this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Todo methods
  async getTodos(): Promise<TodoApiResponse> {
    return await this.get('/tasks');
  }

  async createTodo(title: string): Promise<TodoApiResponse> {
    return await this.post('/tasks', { title });
  }

  async updateTodo(id: string, updates: Partial<{ title: string; completed: boolean }>): Promise<TodoApiResponse> {
    return await this.put(`/tasks/${id}`, updates);
  }

  async deleteTodo(id: string): Promise<TodoApiResponse> {
    return await this.delete(`/tasks/${id}`);
  }

  // Token management
  private setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();