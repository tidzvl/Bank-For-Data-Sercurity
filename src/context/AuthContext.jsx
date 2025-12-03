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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      // Verify token is still valid
      authAPI.verify(token)
        .then(() => {
          setUser(JSON.parse(storedUser));
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const response = await authAPI.login(username, password);

    const userInfo = response.user;
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));

    return userInfo;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
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
