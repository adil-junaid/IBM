const DocumentChunk = require("../models/documentChunk.model");
const { generateEmbedding } = require("./embedding.service");

/**
 * Store document chunks and their embeddings in MongoDB Atlas.
 *
 * @param {Object} options
 * @param {string} options.documentName
 * @param {ObjectId|null} options.documentId
 * @param {Array} options.chunks
 */
async function storeDocumentChunks({
  documentName,
  documentId = null,
  chunks,
}) {
  if (!documentName) {
    throw new Error("documentName is required");
  }

  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new Error("chunks must be a non-empty array");
  }

  console.log(
    `Generating embeddings for ${chunks.length} chunks...`
  );

  const documentsToInsert = [];

  // Generate embeddings one at a time.
  // This is intentionally sequential for now to avoid
  // overwhelming the hosted Hugging Face API.
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    // Support either plain string chunks
    // or objects containing a content/text property.
    const content =
      typeof chunk === "string"
        ? chunk
        : chunk.content || chunk.text;

    if (!content || typeof content !== "string") {
      console.warn(
        `Skipping invalid chunk at index ${i}`
      );
      continue;
    }

    console.log(
      `Generating embedding ${i + 1}/${chunks.length}`
    );

    const embedding = await generateEmbedding(content);

    if (
      !Array.isArray(embedding) ||
      embedding.length !== 384
    ) {
      throw new Error(
        `Invalid embedding dimension for chunk ${i}. Expected 384, received ${
          embedding?.length ?? "unknown"
        }`
      );
    }

    documentsToInsert.push({
      documentName,
      documentId,
      content,
      chunkIndex:
        typeof chunk === "object" &&
        chunk.chunkIndex !== undefined
          ? chunk.chunkIndex
          : i,
      pages:
        typeof chunk === "object"
          ? chunk.pages || null
          : null,
      embedding,
      metadata:
        typeof chunk === "object"
          ? chunk.metadata || {}
          : {},
    });
  }

  if (documentsToInsert.length === 0) {
    throw new Error(
      "No valid document chunks were available to store"
    );
  }

  const savedChunks =
    await DocumentChunk.insertMany(
      documentsToInsert
    );

  console.log(
    `${savedChunks.length} document chunks stored in MongoDB Atlas`
  );

  return savedChunks;
}

/**
 * Delete all stored chunks belonging to a document.
 */
async function deleteDocumentChunks(documentId) {
  if (!documentId) {
    throw new Error("documentId is required");
  }

  const result = await DocumentChunk.deleteMany({
    documentId,
  });

  return result;
}

module.exports = {
  storeDocumentChunks,
  deleteDocumentChunks,
};