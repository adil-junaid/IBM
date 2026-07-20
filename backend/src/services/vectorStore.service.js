const DocumentChunk = require(
  "../models/documentChunk.model"
);

const {
  generateEmbedding,
} = require(
  "./embedding.service"
);

/**
 * Store document chunks and embeddings
 * in MongoDB Atlas.
 */
async function storeDocumentChunks({
  userId,
  documentName,
  documentId = null,
  chunks,
}) {
  // =====================================
  // VALIDATION
  // =====================================

  if (!userId) {
    throw new Error(
      "userId is required"
    );
  }

  if (!documentName) {
    throw new Error(
      "documentName is required"
    );
  }

  if (
    !Array.isArray(chunks) ||
    chunks.length === 0
  ) {
    throw new Error(
      "chunks must be a non-empty array"
    );
  }

  console.log(
    `Generating embeddings for ${chunks.length} chunks...`
  );

  const documentsToInsert =
    [];

  // =====================================
  // GENERATE EMBEDDINGS
  // =====================================

  for (
    let i = 0;
    i < chunks.length;
    i++
  ) {
    const chunk =
      chunks[i];

    const content =
      typeof chunk ===
      "string"
        ? chunk
        : chunk.content ||
          chunk.text;

    if (
      !content ||
      typeof content !==
        "string"
    ) {
      console.warn(
        `Skipping invalid chunk at index ${i}`
      );

      continue;
    }

    console.log(
      `Generating embedding ${i + 1}/${chunks.length}`
    );

    const embedding =
      await generateEmbedding(
        content
      );

    if (
      !Array.isArray(
        embedding
      ) ||
      embedding.length !==
        384
    ) {
      throw new Error(
        `Invalid embedding dimension for chunk ${i}. Expected 384, received ${
          embedding?.length ??
          "unknown"
        }`
      );
    }

    // ===================================
    // Every chunk belongs to userId
    // ===================================

    documentsToInsert.push({
      userId,

      documentName,

      documentId,

      content,

      chunkIndex:
        typeof chunk ===
          "object" &&
        chunk.chunkIndex !==
          undefined
          ? chunk.chunkIndex
          : i,

      pages:
        typeof chunk ===
        "object"
          ? chunk.pages ||
            null
          : null,

      embedding,

      metadata:
        typeof chunk ===
        "object"
          ? chunk.metadata ||
            {}
          : {},
    });
  }

  if (
    documentsToInsert.length ===
    0
  ) {
    throw new Error(
      "No valid document chunks were available to store"
    );
  }

  // =====================================
  // SAVE USER-OWNED CHUNKS
  // =====================================

  const savedChunks =
    await DocumentChunk
      .insertMany(
        documentsToInsert
      );

  console.log(
    `${savedChunks.length} document chunks stored for user ${userId}`
  );

  return savedChunks;
}

/**
 * Delete chunks belonging to a user's
 * specific document.
 */
async function deleteDocumentChunks(
  documentId,
  userId
) {
  if (!documentId) {
    throw new Error(
      "documentId is required"
    );
  }

  if (!userId) {
    throw new Error(
      "userId is required"
    );
  }

  return DocumentChunk.deleteMany({
    documentId,
    userId,
  });
}

module.exports = {
  storeDocumentChunks,
  deleteDocumentChunks,
};