const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");
const { OllamaEmbeddings } = require("@langchain/ollama");

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});

// Stores one MemoryVectorStore per document
const stores = {};

/**
 * Get (or create) a vector store for a document.
 */
function getVectorStore(documentName) {
  if (!stores[documentName]) {
    stores[documentName] = new MemoryVectorStore(embeddings);
  }

  return stores[documentName];
}

/**
 * Return all vector stores.
 */
function getAllVectorStores() {
  return stores;
}

module.exports = {
  getVectorStore,
  getAllVectorStores,
};