const mongoose = require("mongoose");

const documentChunkSchema =
  new mongoose.Schema(
    {
      // Clerk user who owns this chunk
      userId: {
        type: String,
        required: true,
        index: true,
      },

      // Original uploaded document name
      documentName: {
        type: String,
        required: true,
        index: true,
      },

      // MongoDB ID of document record
      documentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Document",
        default: null,
      },

      // Chunk text
      content: {
        type: String,
        required: true,
      },

      // Position in document
      chunkIndex: {
        type: Number,
        required: true,
      },

      // Page information
      pages: {
        type:
          mongoose.Schema.Types.Mixed,
        default: null,
      },

      // Embedding vector
      embedding: {
        type: [Number],
        required: true,
      },

      // Additional metadata
      metadata: {
        type:
          mongoose.Schema.Types.Mixed,
        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

// Important for user-isolated RAG retrieval
documentChunkSchema.index({
  userId: 1,
  documentName: 1,
});

module.exports =
  mongoose.model(
    "DocumentChunk",
    documentChunkSchema
  );