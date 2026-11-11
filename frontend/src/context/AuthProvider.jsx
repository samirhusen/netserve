import { useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  // Saves the token and user details after login or registration
  const saveSession = (data) => {
    const { token, ...profile } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(profile));
    setUser(profile);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    saveSession(data);
    return data;
  };

  const register = async (form) => {
    const { data } = await api.post('/api/auth/register', form);
    saveSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Keeps the navbar name in sync after a profile update
  const updateUser = (profile) => {
    const next = { ...user, fullName: profile.fullName };
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  };

  const value = {
    user,
    isAdmin: user?.role === 'ADMIN',
    isCustomer: user?.role === 'CUSTOMER',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
