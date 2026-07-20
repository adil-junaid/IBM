const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },

    answer: {
      type: String,
      required: true,
    },

    document: {
      type: String,
      default: null,
    },

    sources: [
      {
        document: {
          type: String,
        },
        page: {
          type: mongoose.Schema.Types.Mixed,
        },
        chunk: {
          type: mongoose.Schema.Types.Mixed,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Chat",
  chatSchema
);