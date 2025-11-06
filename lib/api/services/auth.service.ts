// lib/api/services/auth.service.ts
import { loginSchema } from '@/lib/schemas/auth/auth.schema';
import { z } from 'zod';

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export class AuthService {
  async login(email: string, password: string, type: string): Promise<{ user: User; token: string }> {
    try {
      // Validate input using auth.schema.ts
      const loginData = loginSchema.parse({ email, password, type });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      return data as { user: User; token: string };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error instanceof z.ZodError ? new Error(JSON.stringify(error.errors)) : new Error('Failed to log in');
    }
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      throw new Error('Failed to log out');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/user');
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data as User | null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
}