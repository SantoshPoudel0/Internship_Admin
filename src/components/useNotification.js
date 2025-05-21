import { useState, useCallback } from 'react';

const useNotification = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const showSuccess = useCallback((msg, timeout = 3000) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), timeout);
  }, []);

  return {
    error,
    setError,
    success,
    setSuccess,
    showSuccess,
  };
};

export default useNotification; 