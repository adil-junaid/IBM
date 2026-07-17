import api from "../api/api";

export const askQuestion = async (question) => {
  const response = await api.post("/api/chat", {
    question,
  });

  return response.data;
};