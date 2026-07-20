const mongoose = require("mongoose");

const chatSchema =
  new mongoose.Schema(
    {
      // Clerk user who owns chat
      userId: {
        type: String,
        required: true,
        index: true,
      },

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
            type:
              mongoose.Schema.Types
                .Mixed,
          },

          chunk: {
            type:
              mongoose.Schema.Types
                .Mixed,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

chatSchema.index({
  userId: 1,
  createdAt: -1,
});

module.exports =
  mongoose.model(
    "Chat",
    chatSchema
  );