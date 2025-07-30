import React from 'react';
import useDocumentStore from '../../stores/documentStore';
import '../../styles/documents.scss';

const DocumentTable = () => {
  const { documents, loading, error, downloadDocument, deleteDocument } = useDocumentStore();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleDownload = async (doc) => {
    try {
      await downloadDocument(doc.id, doc.filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Are you sure you want to delete "${doc.filename}"?`)) {
      try {
        await deleteDocument(doc.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="document-table-loading">
        <div className="spinner"></div>
        <p>Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Error loading documents: {error}
      </div>
    );
  }

  return (
    <div className="document-table-container">
      <div className="document-table-header">
        <h2>Documents</h2>
        <span className="document-count">
          {documents.length} document{documents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📄</div>
          <h3>No documents yet</h3>
          <p>Upload your first document to get started</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="document-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size</th>
                <th>Upload Date</th>
                <th>Patient ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="document-row">
                  <td className="filename-cell">
                    <div className="file-info">
                      <span className="file-icon">📄</span>
                      <span className="filename">{doc.filename}</span>
                    </div>
                  </td>
                  <td className="size-cell">
                    {formatFileSize(doc.size)}
                  </td>
                  <td className="date-cell">
                    {formatDate(doc.upload_date)}
                  </td>
                  <td className="patient-cell">
                    {doc.patient_id}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleDownload(doc)}
                        title="Download document"
                      >
                        📥 Download
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(doc)}
                        title="Delete document"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentTable; 