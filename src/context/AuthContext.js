import React, { createContext } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export const AuthContext = createContext();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

export const AuthProvider = ({ children }) => {
  // Provide a simplified API instance without auth
  return (
    <AuthContext.Provider
      value={{
        api,
        currentUser: {
          _id: '000000000000000000000001',
          name: 'Admin',
          email: 'admin@example.com',
          isAdmin: true
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 