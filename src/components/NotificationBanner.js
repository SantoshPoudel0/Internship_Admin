import React from 'react';
import { Alert } from 'react-bootstrap';

const NotificationBanner = ({ error, success, setError, setSuccess }) => (
  <>
    {error && (
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    )}
    {success && (
      <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
        {success}
      </Alert>
    )}
  </>
);

export default NotificationBanner; 