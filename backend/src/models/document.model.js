const mongoose = require("mongoose");

const documentSchema =
  new mongoose.Schema(
    {
      // Clerk user who owns this document
      userId: {
        type: String,
        required: true,
        index: true,
      },

      originalName: {
        type: String,
        required: true,
      },

      fileName: {
        type: String,
        required: true,
      },

      fileType: {
        type: String,
        required: true,
      },

      filePath: {
        type: String,
        required: true,
      },

      pages: {
        type: Number,
        default: 0,
      },

      chunks: {
        type: Number,
        default: 0,
      },

      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

// Efficient user-specific document queries
documentSchema.index({
  userId: 1,
  uploadedAt: -1,
});

module.exports =
  mongoose.model(
    "Document",
    documentSchema
  );