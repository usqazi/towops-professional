import axios from 'axios';

const API_BASE_URL = 'https://your-domain.com/api'; // Replace with your deployed API URL

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'customer';
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const response = await this.api.post('/auth/verify', { token });
      return response.data.user || null;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  async logout(): Promise<boolean> {
    try {
      await this.api.post('/auth/logout');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
