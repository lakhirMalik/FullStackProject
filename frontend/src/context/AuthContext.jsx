import { createContext, useContext, useState, useEffect } from 'react';
import {getProfile, logoutUser as logoutRequest} from '../api/authService';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const storedUser = localStorage.getItem('user');
    // const token = localStorage.getItem('token');

    // if (storedUser && token) {
      // setUser(JSON.parse(storedUser));
    // }
    // setLoading(false);
    const checkAuth = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout request failed:', error);
    }
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
