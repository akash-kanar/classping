import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("classping_token", token);

    setUser(user);

    return response.data;
  };

const register = async (
  name,
  email,
  password,
  mobile,
  course,
  branch,
  yearOfStudy
) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    mobile,
    course,
    branch,
    yearOfStudy,
  });

  const { token, user } = response.data;

  localStorage.setItem(
    "classping_token",
    token
  );

  setUser(user);

  return response.data;
};

  const logout = () => {
    localStorage.removeItem("classping_token");
    setUser(null);
  };

  const loadUser = async () => {
    const token = localStorage.getItem("classping_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/users/me");

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("classping_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};