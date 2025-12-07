import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    console.log('[AuthContext] Initializing...', {
      hasStoredUser: !!storedUser,
      hasStoredToken: !!storedToken
    });

    if (storedUser && storedToken) {
      console.log('[AuthContext] Restoring session from localStorage');
      // Restore user session directly without verify (verify on first API call instead)
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('[AuthContext] Parsed user:', parsedUser);
        setUser(parsedUser);
        setToken(storedToken);
        console.log('[AuthContext] Session restored successfully');
      } catch (err) {
        console.error('[AuthContext] Failed to parse stored user:', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } else {
      console.log('[AuthContext] No stored credentials found');
    }
    setLoading(false);
    console.log('[AuthContext] Loading complete');
  }, []);

  const login = async (username, password) => {
    const response = await authAPI.login(username, password);

    const userInfo = response.user;
    const userToken = response.token;

    setUser(userInfo);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', userToken);

    return userInfo;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'CUSTOMER',
    isStaff: user?.role === 'STAFF',
    isDirector: user?.role === 'DIRECTOR'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
