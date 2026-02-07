import { z } from 'zod';

/**
 * Validation schemas for the Todo application
 */

// Signup form validation
export const signupSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Login form validation
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

// Todo form validation
export const todoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters'),
});

// Update todo validation (all fields optional)
export const updateTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters')
    .optional(),
  completed: z.boolean().optional(),
});

// User profile update validation
export const userProfileSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Must be a valid email address'),
});

// Email validation only
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Must be a valid email address');

// Password validation only
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Export types for the schemas
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type TodoFormData = z.infer<typeof todoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
export type UserProfileFormData = z.infer<typeof userProfileSchema>;