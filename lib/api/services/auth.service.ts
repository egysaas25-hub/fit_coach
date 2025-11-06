// lib/api/services/auth.service.ts
export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export class AuthService {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      return data as User;
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Failed to log in');
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error logging out:', error);
      throw new Error('Failed to log out');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/user');
      const data = await response.json();
      return data as User | null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
}