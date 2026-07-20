import axios from "axios";

const api = axios.create({
  // Production:
  // Uses VITE_API_URL configured in Vercel.
  //
  // Local development:
  // Falls back to localhost if VITE_API_URL is not set.
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001",

  // AI/RAG requests can take longer,
  // especially when processing documents.
  timeout: 120000,

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;