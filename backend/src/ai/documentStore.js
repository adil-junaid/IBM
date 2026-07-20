const { registerDocument } = require("./documentRegistry");

const {
  storeDocumentChunks,
} = require("../services/vectorStore.service");

/**
 * Generate hosted embeddings and permanently
 * store document chunks in MongoDB Atlas.
 *
 * @param {string[]} chunks
 * @param {Object} metadata
 * @param {ObjectId} documentId
 */
async function indexDocument(
  chunks,
  metadata,
  documentId
) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error(
      "No document chunks available for indexing."
    );
  }

  if (!documentId) {
    throw new Error(
      "documentId is required for persistent vector storage."
    );
  }

  // Convert plain text chunks into structured chunks
  // for persistent MongoDB storage.
  const structuredChunks = chunks.map(
    (chunk, index) => ({
      content: chunk,
      chunkIndex: index,
      pages: metadata.pages || null,

      metadata: {
        source: metadata.source,
        storedName: metadata.storedName,
        fileSize: metadata.fileSize,
        fileType: metadata.fileType,
        uploadedAt: metadata.uploadedAt,
        chunk: index + 1,
        documentMetadata:
          metadata.metadata || {},
      },
    })
  );

  // Generate Hugging Face embeddings
  // and persist chunks in MongoDB.
  const savedChunks =
    await storeDocumentChunks({
      documentName: metadata.source,
      documentId,
      chunks: structuredChunks,
    });

  // Keep existing document registry working
  // until the old in-memory architecture is
  // completely removed.
  registerDocument({
    id: documentId.toString(),
    name: metadata.source,
    storedName: metadata.storedName,
    pages: metadata.pages,
    chunks: savedChunks.length,
    fileSize: metadata.fileSize,
    fileType: metadata.fileType,
    uploadedAt: metadata.uploadedAt,
    metadata: metadata.metadata,
  });

  return savedChunks.length;
}

module.exports = {
  indexDocument,
};