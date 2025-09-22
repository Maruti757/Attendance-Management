import axios from 'axios';

const api = axios.create({
  baseURL: "/api", // Base URL for API requests
});

// Vite provides ImportMetaEnv and ImportMeta types globally, so no need to redeclare them.

const API_BASE = "/api"; // ← Proxy prefix

export const getUsers = () => {
  return fetch(`${API_BASE}/users`).then((res) => res.json()); // → Fetches /api/users
};

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = new axios.AxiosHeaders();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { username: string; password: string; role: string }) =>
    api.post('/auth/login', credentials),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
};

// Students API
export const studentsAPI = {
  getAll: (division?: string) =>
    api.get(`/students${division ? `?division=${division}` : ''}`),
  
  getById: (id: string) =>
    api.get(`/students/${id}`),
  
  updateAttendance: (id: string, data: { presentClasses: number; totalClasses: number }) =>
    api.put(`/students/${id}/attendance`, data),
};

// Attendance API
export const attendanceAPI = {
  mark: (data: {
    date: string;
    subject: string;
    division: string;
    attendanceData: { [key: string]: 'present' | 'absent' };
  }) => api.post('/attendance/mark', data),
  
  getStats: (division?: string) =>
    api.get(`/attendance/stats${division ? `?division=${division}` : ''}`),
};

// Leave Applications API
export const leavesAPI = {
  submit: (formData: FormData) =>
    api.post('/leaves/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  getAll: (filters?: { division?: string; status?: string }) => {
    const params = new URLSearchParams();
    if (filters?.division) params.append('division', filters.division);
    if (filters?.status) params.append('status', filters.status);
    return api.get(`/leaves?${params.toString()}`);
  },
  
  review: (id: string, data: { status: 'approved' | 'rejected'; comments?: string }) =>
    api.put(`/leaves/${id}/review`, data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (data: any) => api.put('/users/profile', data),
};

export default api;