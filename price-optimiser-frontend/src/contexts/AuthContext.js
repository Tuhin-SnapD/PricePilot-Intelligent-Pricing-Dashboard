import React, { createContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api";

export const AuthContext = createContext();

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

// These endpoints must never trigger another token refresh attempt.
const AUTH_ENDPOINTS = ["/users/login/", "/users/register/", "/users/token/refresh/"];
const isAuthEndpoint = (url = "") => AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshRequest = useRef(null);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refresh = localStorage.getItem(REFRESH_KEY);
    if (!refresh) {
      throw new Error("No refresh token available");
    }

    // Reuse an in-flight request so several simultaneous 401s only refresh once.
    if (!refreshRequest.current) {
      refreshRequest.current = api
        .post("/users/token/refresh/", { refresh })
        .then(({ data }) => {
          if (!data.access) {
            throw new Error("No access token returned");
          }
          localStorage.setItem(ACCESS_KEY, data.access);
          return data.access;
        })
        .finally(() => {
          refreshRequest.current = null;
        });
    }

    return refreshRequest.current;
  }, []);

  const login = useCallback(async (username, password) => {
    const { data } = await api.post("/users/login/", { username, password });
    const access = data.access || data.access_token;
    const refresh = data.refresh || data.refresh_token;

    if (!access || !refresh) {
      throw new Error("The server returned an invalid login response.");
    }

    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);

    let userData = data.user;
    if (!userData) {
      const response = await api.get("/users/me/");
      userData = response.data.success ? response.data.data : response.data;
    }

    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (username, email, password, role) => {
    const { data } = await api.post("/users/register/", {
      username,
      email,
      password,
      role,
    });
    return data;
  }, []);

  // Retry once with a fresh access token when a request returns 401.
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config || {};
        const shouldRefresh =
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint(originalRequest.url);

        if (!shouldRefresh) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const token = await refreshAccessToken();
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${token}`,
          };
          return api(originalRequest);
        } catch (refreshError) {
          logout();
          return Promise.reject(refreshError);
        }
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout, refreshAccessToken]);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      if (!localStorage.getItem(ACCESS_KEY)) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/users/me/");
        if (!cancelled) {
          setUser(data.success ? data.data : data);
        }
      } catch (error) {
        // Do not invent a user when the session cannot be restored.
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
