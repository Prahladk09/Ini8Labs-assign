import { create } from 'zustand';
import { apiService } from '../services/api';

const useDocumentStore = create((set, get) => ({
  // State
  documents: [],
  loading: false,
  error: null,
  uploadProgress: 0,
  isUploading: false,

  // Actions
  fetchDocuments: async (patientId) => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getDocuments(patientId);
      // Sort by upload date (latest first)
      const sortedDocuments = data.sort((a, b) => 
        new Date(b.upload_date) - new Date(a.upload_date)
      );
      
      set({ documents: sortedDocuments, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  uploadDocument: async (file, patientId) => {
    set({ isUploading: true, uploadProgress: 0, error: null });
    
    try {
      const data = await apiService.uploadDocument(file, patientId, (progress) => {
        set({ uploadProgress: progress });
      });
      
      set({ 
        isUploading: false, 
        uploadProgress: 0,
        documents: [data, ...get().documents] // Add new document at the top
      });
      
      return data;
    } catch (error) {
      set({ 
        isUploading: false, 
        uploadProgress: 0,
        error: error.message 
      });
      throw error;
    }
  },

  downloadDocument: async (docId, filename) => {
    try {
      const blob = await apiService.downloadDocument(docId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteDocument: async (docId) => {
    try {
      await apiService.deleteDocument(docId);
      // Remove document from state
      set({ 
        documents: get().documents.filter(doc => doc.id !== docId) 
      });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearUploadProgress: () => set({ uploadProgress: 0, isUploading: false }),
}));

export default useDocumentStore; 