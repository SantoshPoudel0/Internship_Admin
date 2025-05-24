const isDevelopment = process.env.NODE_ENV === 'development';

const config = {
  // API Configuration
  api: {
    baseURL: isDevelopment 
      ? 'http://localhost:5000'
      : process.env.REACT_APP_API_URL,
    timeout: 5000
  },

  // Auth Configuration
  auth: {
    tokenKey: 'token',
    userInfoKey: 'userInfo',
    tokenExpiry: '30d'
  },

  // Routes Configuration
  routes: {
    login: '/login',
    dashboard: '/',
    unauthorized: '/unauthorized'
  }
};

export default config; 