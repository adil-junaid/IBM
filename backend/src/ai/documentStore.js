const {
  registerDocument,
} = require(
  "./documentRegistry"
);

const {
  storeDocumentChunks,
} = require(
  "../services/vectorStore.service"
);

/**
 * Generate embeddings and permanently
 * store document chunks in MongoDB Atlas.
 */
async function indexDocument(
  chunks,
  metadata,
  documentId,
  userId
) {
  if (
    !Array.isArray(chunks) ||
    chunks.length === 0
  ) {
    throw new Error(
      "No document chunks available for indexing."
    );
  }

  if (!documentId) {
    throw new Error(
      "documentId is required for persistent vector storage."
    );
  }

  if (!userId) {
    throw new Error(
      "userId is required for persistent vector storage."
    );
  }

  const structuredChunks =
    chunks.map(
      (
        chunk,
        index
      ) => ({
        content:
          chunk,

        chunkIndex:
          index,

        pages:
          metadata.pages ||
          null,

        metadata: {
          source:
            metadata.source,

          storedName:
            metadata.storedName,

          fileSize:
            metadata.fileSize,

          fileType:
            metadata.fileType,

          uploadedAt:
            metadata.uploadedAt,

          chunk:
            index + 1,

          documentMetadata:
            metadata.metadata ||
            {},
        },
      })
    );

  // =====================================
  // Store chunks with user ownership
  // =====================================

  const savedChunks =
    await storeDocumentChunks({
      userId,

      documentName:
        metadata.source,

      documentId,

      chunks:
        structuredChunks,
    });

  // Keep existing registry working.
  //
  // IMPORTANT:
  // The persistent RAG system will use
  // MongoDB + userId for security.
  registerDocument({
    id:
      documentId.toString(),

    name:
      metadata.source,

    storedName:
      metadata.storedName,

    pages:
      metadata.pages,

    chunks:
      savedChunks.length,

    fileSize:
      metadata.fileSize,

    fileType:
      metadata.fileType,

    uploadedAt:
      metadata.uploadedAt,

    metadata:
      metadata.metadata,
  });

  return savedChunks.length;
}

module.exports = {
  indexDocument,
};