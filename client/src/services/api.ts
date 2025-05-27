import axios, { type AxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:5005';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return api.get<T, T>(url, config);
};

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return api.post<T, T>(url, data, config);
};

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return api.put<T, T>(url, data, config);
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return api.delete<T, T>(url, config);
};

export default api;
