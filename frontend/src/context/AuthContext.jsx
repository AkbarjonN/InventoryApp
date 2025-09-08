import React, { createContext, useState } from "react";
import { auth as authApi } from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  );

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data;
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Login successful");
  };

  const register = async (data) => {
    await authApi.register(data);
    toast.success("Registered! Please login.");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out");
    window.location.href = "/login";
  };

  const [globalQuery, setGlobalQuery] = useState("");

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, globalQuery, setGlobalQuery }}
    >
      {children}
    </AuthContext.Provider>
  );
}
