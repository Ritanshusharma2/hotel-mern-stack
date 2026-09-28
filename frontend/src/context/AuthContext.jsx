import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Setup axios authorization header defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } catch (err) {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);
  

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post('/api/auth/register', { name, email, password, phone });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
