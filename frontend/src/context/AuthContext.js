import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  // const [showLinkedInPrompt, setShowLinkedInPrompt] = useState(false);
  // const navigate = useNavigate();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/auth/me/');
      setUser(response.data);
      // If user logged in with Google and has no LinkedIn URL, show prompt
      if (response.data.auth_provider === 'google' && !response.data.linkedin_url) {
        // setShowLinkedInPrompt(true);
      } else {
        // setShowLinkedInPrompt(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchCurrentUser]);

  const login = (userData, tokens) => {
    setUser(userData);
    setToken(tokens.access);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    // If Google login and no LinkedIn, show prompt
    if (userData.auth_provider === 'google' && !userData.linkedin_url) {
      // setShowLinkedInPrompt(true);
    } else {
      // setShowLinkedInPrompt(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

