// src/context/authContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getProfile, logout as logoutService, refreshToken } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authentication on route change (skip public routes)
  useEffect(() => {
    const skipRoutes = ["/", "/login",];
    if (skipRoutes.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const profile = await getProfile();
        setUser(profile.user);
      } catch (err) {
        // Attempt silent refresh if refresh token exists
        try {
          setIsRefreshing(true);
          await refreshToken(); // calls /auth/refresh using cookie
          const profile = await getProfile(); // retry after refresh
          setUser(profile.user);
        } catch {
          setUser(null); // user remains unauthenticated
        } finally {
          setIsRefreshing(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Logout helper
  const logout = async () => {
    try {
      await logoutService(); // clears server-side session/cookie
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, isRefreshing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
