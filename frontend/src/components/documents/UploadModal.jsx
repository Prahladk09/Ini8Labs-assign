import React, { useState } from 'react';
import useDocumentStore from '../../stores/documentStore';
import '../../styles/modal.scss';

const UploadModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [errors, setErrors] = useState({});

  const { uploadDocument, isUploading, uploadProgress, error, clearError } = useDocumentStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  const handlePatientIdChange = (e) => {
    setPatientId(e.target.value);
    setErrors(prev => ({ ...prev, patientId: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a file';
    } else if (selectedFile.type !== 'application/pdf') {
      newErrors.file = 'Only PDF files are allowed';
    } else if (selectedFile.size > 10 * 1024 * 1024) {
      newErrors.file = 'File size must be less than 10MB';
    }

    if (!patientId.trim()) {
      newErrors.patientId = 'Patient ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await uploadDocument(selectedFile, patientId);
      // Reset form and close modal on success
      setSelectedFile(null);
      setPatientId('');
      setErrors({});
      onClose();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setPatientId('');
      setErrors({});
      clearError();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upload Document</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isUploading}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="patient-id" className="form-label">
              Patient ID *
            </label>
            <input
              type="text"
              id="patient-id"
              value={patientId}
              onChange={handlePatientIdChange}
              className={`form-input ${errors.patientId ? 'error' : ''}`}
              placeholder="Enter patient ID"
              disabled={isUploading}
            />
            {errors.patientId && (
              <div className="form-error">{errors.patientId}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="file-upload" className="form-label">
              PDF Document *
            </label>
            <div className="file-upload-container">
              <input
                type="file"
                id="file-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
                disabled={isUploading}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                <div className="file-upload-content">
                  <span className="file-upload-icon">📄</span>
                  <span className="file-upload-text">
                    {selectedFile ? selectedFile.name : 'Choose PDF file'}
                  </span>
                  <span className="file-upload-hint">
                    {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Max 10MB'}
                  </span>
                </div>
              </label>
            </div>
            {errors.file && (
              <div className="form-error">{errors.file}</div>
            )}
          </div>

          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Uploading... {uploadProgress}%
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUploading || !selectedFile || !patientId.trim()}
            >
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal; 