const { ChatOllama } = require("@langchain/ollama");

const llm = new ChatOllama({
  model: "llama3.2",
  baseUrl: "http://127.0.0.1:11434",
  temperature: 0,
});

async function generateAnswer(prompt) {
  const response = await llm.invoke(prompt);

  return response.content;
}

module.exports = {
  generateAnswer,
};