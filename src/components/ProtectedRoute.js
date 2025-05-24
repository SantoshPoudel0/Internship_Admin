import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from 'react-bootstrap/Spinner';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  // Always allow access in development
  if (process.env.NODE_ENV === 'development') {
    return children;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!currentUser) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // User is authenticated and not an admin
  if (!currentUser.isAdmin) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <h3>Access Denied</h3>
        <p>You do not have permission to access this area.</p>
      </div>
    );
  }

  // User is authenticated and admin
  return children;
};

export default ProtectedRoute; 