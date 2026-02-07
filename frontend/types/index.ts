// frontend/types/index.ts
// Main types barrel file

export type { User, AuthResponse } from './user';
export type { TodoApiResponse } from './api';

// Export everything from subdirectories as well
export * from './todo';
export * from './user';
export * from './api';