import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import DocumentTable from '../components/documents/DocumentTable';
import useDocumentStore from '../stores/documentStore';
import '../styles/dashboard.scss';

const DashboardPage = () => {
  const [patientId, setPatientId] = useState('demo-patient');
  const { fetchDocuments, clearError } = useDocumentStore();

  useEffect(() => {
    fetchDocuments(patientId);
  }, [patientId, fetchDocuments]);

  const handlePatientIdChange = (e) => {
    setPatientId(e.target.value);
    clearError();
  };

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <div className="patient-selector">
              <label htmlFor="patient-id" className="form-label">
                Patient ID
              </label>
              <input
                type="text"
                id="patient-id"
                value={patientId}
                onChange={handlePatientIdChange}
                className="form-input patient-input"
                placeholder="Enter patient ID"
              />
            </div>
          </div>

          <DocumentTable />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 