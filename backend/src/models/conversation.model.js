const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema(
    {
      role: {
        type: String,
        enum: [
          "user",
          "assistant",
        ],
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      sources: [
        {
          document: String,

          page:
            mongoose.Schema.Types
              .Mixed,

          chunk:
            mongoose.Schema.Types
              .Mixed,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

const conversationSchema =
  new mongoose.Schema(
    {
      // Clerk user who owns conversation
      userId: {
        type: String,
        required: true,
        index: true,
      },

      title: {
        type: String,
        default:
          "New Conversation",
        trim: true,
      },

      // null = All Documents
      document: {
        type: String,
        default: null,
      },

      messages: {
        type: [messageSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

// Efficient user-specific history
conversationSchema.index({
  userId: 1,
  updatedAt: -1,
});

const Conversation =
  mongoose.model(
    "Conversation",
    conversationSchema
  );

module.exports =
  Conversation;