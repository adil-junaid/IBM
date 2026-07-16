const { ChatOllama } = require("@langchain/ollama");

const llm = new ChatOllama({
  model: "llama3.2",
  baseUrl: "http://127.0.0.1:11434",
  temperature: 0,
});

module.exports = llm;