import api from "../api/api";

export const uploadDocument = async (formData) => {
  const response = await api.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};