const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model("Document", documentSchema);