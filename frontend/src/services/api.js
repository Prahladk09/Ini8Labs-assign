import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-storage') 
      ? JSON.parse(localStorage.getItem('auth-storage')).state?.token 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('auth-storage');
      window.location.href = '/auth';
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle server errors
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  SIGNUP: '/signup',
  LOGIN: '/login',
  
  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT_UPLOAD: '/documents/upload',
  DOCUMENT_DOWNLOAD: (id) => `/documents/${id}/download`,
  DOCUMENT_DELETE: (id) => `/documents/${id}`,
};

// API methods
export const apiService = {
  // Authentication
  signup: async (userData) => {
    const response = await api.post(API_ENDPOINTS.SIGNUP, userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  // Documents
  getDocuments: async (patientId) => {
    const response = await api.get(API_ENDPOINTS.DOCUMENTS, {
      params: { patient_id: patientId }
    });
    return response.data;
  },

  uploadDocument: async (file, patientId, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);

    const response = await api.post(API_ENDPOINTS.DOCUMENT_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
    return response.data;
  },

  downloadDocument: async (docId) => {
    const response = await api.get(API_ENDPOINTS.DOCUMENT_DOWNLOAD(docId), {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteDocument: async (docId) => {
    const response = await api.delete(API_ENDPOINTS.DOCUMENT_DELETE(docId));
    return response.data;
  },
};

export default api; 