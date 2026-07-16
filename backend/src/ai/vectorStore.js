const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const { OllamaEmbeddings } = require("@langchain/ollama");

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});

const vectorStore = new MemoryVectorStore(embeddings);

module.exports = vectorStore;