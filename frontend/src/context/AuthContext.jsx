import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from 'react';

import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await authService.getMe();
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    // Admin: backend returns requiresVerification — no token yet
    if (response.data.requiresVerification) {
      return response;
    }

    const { token, user } = response.data.data;

    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);

    return response;
  };

  // ── REGISTER ───────────────────────────────────────────────────────────────

  const register = async (data) => {
    const response = await authService.register(data);
    const { token, user } = response.data.data;

    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);

    return response;
  };

  // ── ADMIN VERIFY LOGIN ─────────────────────────────────────────────────────

  const verifyAdminLogin = async (token) => {
    const response = await authService.verifyAdminLogin(token);
    const { token: authToken, user } = response.data;

    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(user);

    return response;
  };

  // ── LOGOUT ─────────────────────────────────────────────────────────────────

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // ── UPDATE USER ────────────────────────────────────────────────────────────

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // ── DELETE ACCOUNT ─────────────────────────────────────────────────────────

  const deleteAccount = async () => {
    await authService.deleteAccount();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // ── ROLE HELPERS ───────────────────────────────────────────────────────────

  const isAdmin    = user?.role === 'admin';
  const isArtisan  = user?.role === 'artisan';
  const isCustomer = user?.role === 'customer';
  const isAuthenticated = !!token && !!user;

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    deleteAccount,
    verifyAdminLogin,
    isAuthenticated,
    isAdmin,
    isArtisan,
    isCustomer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
