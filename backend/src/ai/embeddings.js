const { OllamaEmbeddings } = require("@langchain/ollama");

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  baseUrl: "http://127.0.0.1:11434",
});

const generateEmbedding = async (text) => {
  try {
    const vector = await embeddings.embedQuery(text);
    return vector;
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

module.exports = {
  generateEmbedding,
};