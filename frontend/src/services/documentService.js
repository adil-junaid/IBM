import api from "../api/api";

export const getDocuments = async () => {
  const response = await api.get("/api/documents");

  return response.data;
};

export const deleteDocument = async (name) => {
  const response = await api.delete(
    `/api/documents/${encodeURIComponent(name)}`
  );

  return response.data;
};