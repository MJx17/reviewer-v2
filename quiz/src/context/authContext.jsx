// import { createContext, useContext, useState, useEffect } from "react";
// import { getProfile, refreshToken, loginService } from "../services/authService";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // true while checking auth

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const profile = await getProfile();
//         setUser(profile.user);
//       } catch {
//         try {
//           await refreshToken(); // refresh cookie-based token
//           const profile = await getProfile();
//           setUser(profile.user);
//         } catch {
//           setUser(null);
//         }
//       } finally {
//         setLoading(false); // done checking
//       }
//     };

//     checkAuth();
//   }, []);

//   const logout = async () => {
//     try {
//       await logoutService(); // clears server-side session/cookie
//     } catch (err) {
//       console.error("Logout failed:", err.message);
//     } finally {
//       setUser(null);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


// import { createContext, useContext, useState, useEffect } from "react";
// import { getProfile, refreshToken, logoutService } from "../services/authService";

// const AuthContext = createContext(null);

// const LOCAL_STORAGE_USER_KEY = "user";
// const LOCAL_STORAGE_TOKEN_KEY = "accessToken";

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
//     return saved ? JSON.parse(saved) : null;
//   });
//   const [accessToken, setAccessToken] = useState(() => {
//     return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || null;
//   });
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Save to localStorage whenever user or token changes
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
//     } else {
//       localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (accessToken) {
//       localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
//     } else {
//       localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
//     }
//   }, [accessToken]);

//   // Restore session on mount
//   useEffect(() => {
//     const restoreSession = async () => {
//       try {
//         setIsRefreshing(true);

//         // Try refreshing token first
//         const refreshed = await refreshToken();
//         if (refreshed.accessToken) setAccessToken(refreshed.accessToken);

//         // Fetch profile to ensure user data is up to date
//         const profile = await getProfile(refreshed.accessToken);
//         setUser(profile.user);
//       } catch (err) {
//         setUser(null);
//         setAccessToken(null);
//       } finally {
//         setIsRefreshing(false);
//         setLoading(false);
//       }
//     };

//     restoreSession();
//   }, []);

//   const fetchProfile = async () => {
//     setLoading(true);
//     try {
//       const profile = await getProfile(accessToken);
//       setUser(profile.user);
//       if (profile.accessToken) setAccessToken(profile.accessToken);
//     } catch (err) {
//       setUser(null);
//       setAccessToken(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshAccessToken = async () => {
//     setIsRefreshing(true);
//     try {
//       const refreshed = await refreshToken();
//       if (refreshed.accessToken) setAccessToken(refreshed.accessToken);

//       const profile = await getProfile(refreshed.accessToken);
//       setUser(profile.user);
//     } catch {
//       setUser(null);
//       setAccessToken(null);
//     } finally {
//       setIsRefreshing(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await logoutService();
//     } catch (err) {
//       console.error("Logout failed:", err.message);
//     } finally {
//       setUser(null);
//       setAccessToken(null);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         accessToken,
//         setUser,
//         setAccessToken,
//         fetchProfile,
//         refreshAccessToken,
//         logout,
//         loading,
//         isRefreshing,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import { createContext, useContext, useState, useEffect } from "react";
import { getProfile, refreshToken, logoutService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ===== Restore session on mount =====
  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      try {
        setIsRefreshing(true);

        // 1️⃣ Refresh token via cookie (HTTP-only)
        const refreshed = await refreshToken(); // server returns new accessToken
        if (refreshed.accessToken) setAccessToken(refreshed.accessToken);

        // 2️⃣ Fetch user profile
        const profile = await getProfile(refreshed.accessToken);
        setUser(profile.user);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsRefreshing(false);
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ===== Fetch profile manually =====
  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!accessToken) throw new Error("No access token");
      const profile = await getProfile(accessToken);
      setUser(profile.user);
      if (profile.accessToken) setAccessToken(profile.accessToken);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  // ===== Refresh access token manually =====
  const refreshAccessToken = async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await refreshToken();
      if (refreshed.accessToken) setAccessToken(refreshed.accessToken);

      const profile = await getProfile(refreshed.accessToken);
      setUser(profile.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ===== Logout =====
  const logout = async () => {
    try {
      await logoutService(); // clears refresh token cookie on server
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken,
        fetchProfile,
        refreshAccessToken,
        logout,
        loading,
        isRefreshing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
