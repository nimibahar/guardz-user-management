import axios from 'axios';
import type { User } from '../types/user';
import type { CreateUserDto } from '../types/user';

// Simple environment-driven API URL configuration
const getApiBaseUrl = () => {
  // Always prefer environment variable if set
  return import.meta.env.VITE_API_URL || 'http://localhost:8080';
};

const API_BASE_URL = getApiBaseUrl();


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },

  createUser: async (user: CreateUserDto): Promise<User> => {
    const response = await apiClient.post<User>('/users', user);
    return response.data;
  },
};