const { registerDocument } = require("./documentRegistry");
const { Document } = require("@langchain/core/documents");
const { getVectorStore } = require("./vectorStore");
const crypto = require("crypto");

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
  // Register the uploaded document
registerDocument({
  id: crypto.randomUUID(),
  name: metadata.source,
  storedName: metadata.storedName,
  pages: metadata.pages,
  chunks: docs.length,
  fileSize: metadata.fileSize,
  fileType: metadata.fileType,
  uploadedAt: metadata.uploadedAt,
  metadata: metadata.metadata,
});

  return docs.length;
}

module.exports = {
  indexDocument,
};