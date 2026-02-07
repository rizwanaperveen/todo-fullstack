// frontend/types/api.ts

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
  error?: string;
}

export interface TodoApiResponse {
  success?: boolean;
  todo?: {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    userId: string;
  };
  todos?: Array<{
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    userId: string;
  }>;
  error?: string;
}