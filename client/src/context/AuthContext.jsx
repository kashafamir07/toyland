import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

const TOKEN_KEY = "toyland_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        console.log("AUTH /me USER:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("AUTH /me ERROR:", err.response?.data || err.message);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem(TOKEN_KEY, res.data.token);

    // IMPORTANT: immediately store the complete logged-in user
    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    });

    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      phone,
    });

    localStorage.setItem(TOKEN_KEY, res.data.token);

    setUser({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    });

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);