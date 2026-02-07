export const AUTH_ENDPOINTS = {
  SIGNUP: '/api/auth/signup',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
} as const;

export const TODO_ENDPOINTS = {
  GET_TODOS: '/tasks',
  CREATE_TODO: '/tasks',
  UPDATE_TODO: (id: string) => `/tasks/${id}` as const,
  DELETE_TODO: (id: string) => `/tasks/${id}` as const,
} as const;

export type AuthEndpoint = typeof AUTH_ENDPOINTS;
export type TodoEndpoint = typeof TODO_ENDPOINTS;