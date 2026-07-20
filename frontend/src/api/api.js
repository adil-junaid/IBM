import axios from "axios";

import {
  getAuthToken,
} from "../services/authToken";

// ========================================
// CREATE AXIOS INSTANCE
// ========================================

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001",

  // AI/RAG and document uploads
  // may take longer.
  timeout: 120000,
});

// ========================================
// AUTHENTICATION INTERCEPTOR
//
// Automatically adds the current Clerk
// session token to every Axios request.
//
// Authorization:
// Bearer <Clerk token>
// ========================================

api.interceptors.request.use(
  async (config) => {
    const token =
      await getAuthToken();

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

// ========================================
// EXPORT
// ========================================

export default api;