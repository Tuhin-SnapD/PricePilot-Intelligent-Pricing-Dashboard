import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      console.log("Attempting login for:", username);
      const response = await api.post("/users/login/", { username, password });
      
      console.log("Login response:", response.data);
      
      // Handle different response formats
      let accessToken, refreshToken, userData;
      
      if (response.data.success) {
        // Custom login view format
        accessToken = response.data.access;
        refreshToken = response.data.refresh;
        userData = response.data.user;
        console.log("Using custom login view response format");
      } else if (response.data.access) {
        // Fallback JWT format
        accessToken = response.data.access;
        refreshToken = response.data.refresh;
        console.log("Using fallback JWT response format");
      } else {
        throw new Error("No access token received");
      }
      
      if (accessToken && refreshToken) {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        api.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
        
        // Set user data
        if (userData) {
          setUser(userData);
        } else {
          // Fallback: get user details from /me endpoint
          try {
            const userResponse = await api.get("/users/me/");
            const user = userResponse.data.success ? userResponse.data.data : userResponse.data;
            setUser(user);
          } catch (userError) {
            console.error("Failed to get user details:", userError);
            // Create basic user object from login data
            setUser({
              username: username,
              role: 'user' // Default role
            });
          }
        }
        
        console.log("Login successful for:", username);
        return response.data;
      } else {
        throw new Error("Missing tokens in response");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (username, email, password, role) => {
    try {
      console.log("Attempting registration:", { username, email, role });
      
      const response = await api.post("/users/register/", {
        username,
        email,
        password,
        role
      });
      
      console.log("Registration successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      
      // Log detailed error information
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("Network error:", error.request);
      } else {
        console.error("Other error:", error.message);
      }
      
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers["Authorization"];
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        throw new Error("No refresh token");
      }
      
      console.log("Attempting token refresh...");
      const response = await api.post("/users/token/refresh/", {
        refresh: refresh
      });
      
      const newAccessToken = response.data.access;
      localStorage.setItem("access_token", newAccessToken);
      api.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
      
      console.log("Token refresh successful");
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        api.defaults.headers["Authorization"] = `Bearer ${token}`;
        try {
          const userData = await api.get("/users/me/");
          // Handle both old and new response formats
          const user = userData.data.success ? userData.data.data : userData.data;
          setUser(user);
          console.log("User loaded:", user.username);
        } catch (error) {
          console.error("Failed to load user:", error);
          if (error.response?.status === 401) {
            // Token expired, try to refresh
            try {
              await refreshToken();
              const userData = await api.get("/users/me/");
              const user = userData.data.success ? userData.data.data : userData.data;
              setUser(user);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              logout();
            }
          } else {
            logout();
          }
        }
      }
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Add token refresh interceptor
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await refreshToken();
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
