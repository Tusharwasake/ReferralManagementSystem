import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Disable credentials for now
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error("Request error:", error);
  return Promise.reject(error);
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle both 401 (Unauthorized) and 403 (Forbidden) as auth failures
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Only try to refresh if we get 401 and have a token stored
      const token = localStorage.getItem("accessToken");
      if (error.response?.status === 401 && token) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`
          );
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/signup"
          ) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        // For 403 errors or when no token exists, clear storage and redirect
        localStorage.removeItem("accessToken");
        if (
          window.location.pathname !== "/login" &&
          window.location.pathname !== "/signup"
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh-token"),
};

// Candidates API
export const candidatesAPI = {
  getAll: (params) => api.get("/candidates", { params }),
  getById: (id) => api.get(`/candidates/${id}`),
  create: (data) =>
    api.post("/candidates", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateStatus: (id, status) => api.put(`/candidates/${id}/status`, { status }),
  update: (id, data) => api.put(`/candidates/${id}`, data),
  delete: (id) => api.delete(`/candidates/${id}`),
  downloadResume: (id) =>
    api.get(`/candidates/${id}/resume`, { responseType: "blob" }),
  getStats: () => api.get("/candidates/stats"),
};

export default api;
