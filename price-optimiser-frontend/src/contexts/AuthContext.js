import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const response = await api.post('/users/login/', { username, password });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    api.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
    const userData = await api.get('/users/me/');
    setUser(userData.data);
  };

  const register = async (username, email, password, role) => {
    await api.post('/users/register/', { username, email, password, role });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
        try {
          const userData = await api.get('/users/me/');
          setUser(userData.data);
        } catch (error) {
          console.error('Invalid token', error);
          logout();
        }
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
