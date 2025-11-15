import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Patient API
export const patientAPI = {
  getProfile: () => api.get("/patients/profile"),
  updateProfile: (data) => api.put("/patients/profile", data),
  addEmergencyContact: (data) => api.post("/patients/emergency-contacts", data),
  updateEmergencyContact: (id, data) =>
    api.put(`/patients/emergency-contacts/${id}`, data),
  deleteEmergencyContact: (id) =>
    api.delete(`/patients/emergency-contacts/${id}`),
  updateHealthCategories: (categories) =>
    api.put("/patients/health-categories", { categories }),
};

// Hospital API
export const hospitalAPI = {
  search: (params) => api.get("/hospitals", { params }),
  getDetails: (id) => api.get(`/hospitals/${id}`),
  getDepartments: (id) => api.get(`/hospitals/${id}/departments`),
  getDoctors: (id, params) => api.get(`/hospitals/${id}/doctors`, { params }),
  getAmbulances: (id) => api.get(`/hospitals/${id}/ambulances`),
  getCities: () => api.get("/hospitals/cities"),
  getNames: () => api.get("/hospitals/names"),
};

// Emergency Links API
export const emergencyLinkAPI = {
  create: (data) => api.post("/emergency-links", data),
  getAll: () => api.get("/emergency-links"),
  update: (id, data) => api.put(`/emergency-links/${id}`, data),
  delete: (id) => api.delete(`/emergency-links/${id}`),
};

// Booking API
export const bookingAPI = {
  create: (data) => api.post("/bookings", data),
  getAll: (params) => api.get("/bookings", { params }),
  getDetails: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
  trackAmbulance: (id, data) => api.post(`/bookings/${id}/track`, data),
};

export default api;
