import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Request interceptor: add auth token and common headers to every request
axios.interceptors.request.use((config) => {
  config.headers["Accept"] = "application/json";
  config.headers["Content-Type"] = "application/json";
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

interface LoginData {
  uernameOrEmail: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const authService = {  
  async login(data: LoginData) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      usernameOrEmail: data.uernameOrEmail,
      password: data.password,
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },

  getCurrentToken() {
    return localStorage.getItem("token");
  },
  
  getBaseApiUrl() {
    return API_URL;
  }
};
