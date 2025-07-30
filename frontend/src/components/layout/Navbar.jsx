import React, { useState } from 'react';
import useAuthStore from '../../stores/authStore';
import UploadModal from '../documents/UploadModal';
import '../../styles/navbar.scss';

const Navbar = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1>📄 Document Manager</h1>
          </div>

          <div className="navbar-actions">
            <button
              className="btn btn-primary upload-btn"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <span className="upload-icon">+</span>
              Upload Document
            </button>

            <div className="user-menu">
              <button
                className="user-menu-toggle"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <span className="user-avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
                <span className="user-name">{user?.username}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <span className="user-email">{user?.username}</span>
                  </div>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 