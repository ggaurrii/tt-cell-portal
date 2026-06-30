import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = ((import.meta as any).env?.VITE_API_URL) || 'http://localhost:8000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 / token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Token refresh logic would go here
      localStorage.removeItem('tt_token');
      localStorage.removeItem('tt_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API helpers
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then(r => r.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then(r => r.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then(r => r.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config).then(r => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then(r => r.data),
};

// Auth endpoints
export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login/', { email, password }),
  logout: () => api.post('/auth/logout/'),
  refreshToken: (refresh: string) =>
    api.post<{ access: string }>('/auth/token/refresh/', { refresh }),
  forgotPassword: (email: string) =>
    api.post('/auth/password/reset/', { email }),
};

// Student endpoints
export const studentService = {
  getAll: (params?: Record<string, any>) =>
    api.get<any>('/students/', { params }),
  getById: (id: string) => api.get<any>(`/students/${id}/`),
  create: (data: any) => api.post<any>('/students/', data),
  update: (id: string, data: any) => api.put<any>(`/students/${id}/`, data),
  delete: (id: string) => api.delete(`/students/${id}/`),
  getAttendance: (id: string) => api.get<any>(`/students/${id}/attendance/`),
  getProjects: (id: string) => api.get<any>(`/students/${id}/projects/`),
};

// Project endpoints
export const projectService = {
  getAll: (params?: Record<string, any>) =>
    api.get<any>('/projects/', { params }),
  getById: (id: string) => api.get<any>(`/projects/${id}/`),
  create: (data: any) => api.post<any>('/projects/', data),
  update: (id: string, data: any) => api.put<any>(`/projects/${id}/`, data),
  delete: (id: string) => api.delete(`/projects/${id}/`),
};

// Attendance endpoints
export const attendanceService = {
  getByDate: (date: string) => api.get<any>('/attendance/', { params: { date } }),
  markAttendance: (data: any) => api.post<any>('/attendance/', data),
  getStudentAttendance: (studentId: string, params?: any) =>
    api.get<any>(`/attendance/student/${studentId}/`, { params }),
  getSummary: (params?: any) => api.get<any>('/attendance/summary/', { params }),
};

// Announcement endpoints
export const announcementService = {
  getAll: (params?: Record<string, any>) =>
    api.get<any>('/announcements/', { params }),
  getById: (id: string) => api.get<any>(`/announcements/${id}/`),
  create: (data: any) => api.post<any>('/announcements/', data),
  update: (id: string, data: any) => api.put<any>(`/announcements/${id}/`, data),
  delete: (id: string) => api.delete(`/announcements/${id}/`),
};

// Dashboard endpoints
export const dashboardService = {
  getAdminStats: () => api.get<any>('/dashboard/admin/'),
  getStudentStats: (studentId: string) =>
    api.get<any>(`/dashboard/student/${studentId}/`),
};

export default apiClient;
