const { Document } = require("@langchain/core/documents");
const vectorStore = require("./vectorStore");

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

  await vectorStore.addDocuments(docs);

  return docs.length;
}

module.exports = {
  indexDocument,
};