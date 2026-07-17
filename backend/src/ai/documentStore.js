const { registerDocument } = require("./documentRegistry");
const { Document } = require("@langchain/core/documents");
const { getVectorStore } = require("./vectorStore");

/**
 * Store document chunks in the vector store.
 * @param {string[]} chunks
 * @param {Object} metadata
 */
async function indexDocument(chunks, metadata) {
  const docs = chunks.map((chunk, index) => {
    return new Document({
      pageContent: chunk,
      metadata: {
        ...metadata,
        chunk: index + 1,
      },
    });
  });

 const store = getVectorStore(metadata.source);

await store.addDocuments(docs);

  // Register the uploaded document
  registerDocument({
    name: metadata.source,
    pages: metadata.pages,
    chunks: docs.length,
  });

  return docs.length;
}

module.exports = {
  indexDocument,
};