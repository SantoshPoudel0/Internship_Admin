import config from '../config';

// Token storage keys
const TOKEN_KEY = 'token';
const USER_INFO_KEY = 'userInfo';

// Store token and user info
export const storeAuthData = (token, userInfo) => {
  try {
    console.log('Storing auth data:', { token: !!token, userInfo: !!userInfo });
    localStorage.setItem(config.auth.tokenKey, token);
    localStorage.setItem(config.auth.userInfoKey, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

// Get stored token
export const getStoredToken = () => {
  try {
    const token = localStorage.getItem(config.auth.tokenKey);
    console.log('Retrieved token:', token ? 'Present' : 'Missing');
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Get stored user info
export const getStoredUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(config.auth.userInfoKey);
    console.log('Retrieved user info:', userInfo ? 'Present' : 'Missing');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

// Clear stored auth data
export const clearAuthData = () => {
  try {
    console.log('Clearing auth data');
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userInfoKey);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) {
    console.log('Token expiry check: No token provided');
    return true;
  }
  
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    const isExpired = Date.now() >= expirationTime;
    console.log('Token expiry check:', {
      expiresAt: new Date(expirationTime).toISOString(),
      isExpired
    });
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getStoredToken();
  const userInfo = getStoredUserInfo();
  const authenticated = token && userInfo && !isTokenExpired(token);
  
  console.log('Authentication check:', {
    hasToken: !!token,
    hasUserInfo: !!userInfo,
    isAuthenticated: authenticated
  });
  
  return authenticated;
}; 