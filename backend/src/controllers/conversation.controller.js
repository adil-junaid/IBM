const Conversation = require(
  "../models/conversation.model"
);

const {
  askQuestion,
} = require(
  "../ai/rag.service"
);

// ========================================
// GET ALL USER CONVERSATIONS
// ========================================

const getConversations = async (
  req,
  res
) => {
  try {
    const userId =
      req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication required.",
        });
    }

    // Only conversations belonging
    // to the authenticated user.
    const conversations =
      await Conversation.find({
        userId,
      }).sort({
        updatedAt: -1,
      });

    return res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "Get conversations error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to fetch conversations.",
      });
  }
};

// ========================================
// GET ONE USER CONVERSATION
// ========================================

const getConversation = async (
  req,
  res
) => {
  try {
    const userId =
      req.userId;

    const {
      conversationId,
    } = req.params;

    const conversation =
      await Conversation.findOne({
        _id:
          conversationId,

        userId,
      });

    if (!conversation) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Conversation not found.",
        });
    }

    return res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "Get conversation error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to fetch conversation.",
      });
  }
};

// ========================================
// DELETE USER CONVERSATION
// ========================================

const deleteConversation = async (
  req,
  res
) => {
  try {
    const userId =
      req.userId;

    const {
      conversationId,
    } = req.params;

    // Delete only if the conversation
    // belongs to this user.
    const conversation =
      await Conversation
        .findOneAndDelete({
          _id:
            conversationId,

          userId,
        });

    if (!conversation) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Conversation not found.",
        });
    }

    return res.json({
      success: true,

      message:
        "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete conversation error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to delete conversation.",
      });
  }
};

// ========================================
// CLEAR USER CONVERSATION MESSAGES
// ========================================

const clearConversation = async (
  req,
  res
) => {
  try {
    const userId =
      req.userId;

    const {
      conversationId,
    } = req.params;

    // Verify conversation ownership.
    const conversation =
      await Conversation.findOne({
        _id:
          conversationId,

        userId,
      });

    if (!conversation) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Conversation not found.",
        });
    }

    conversation.messages =
      [];

    await conversation.save();

    return res.json({
      success: true,

      message:
        "Conversation cleared successfully.",

      conversation,
    });
  } catch (error) {
    console.error(
      "Clear conversation error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to clear conversation.",
      });
  }
};

// ========================================
// EDIT USER MESSAGE + REGENERATE
// ========================================

const editConversationMessage =
  async (
    req,
    res
  ) => {
    try {
      const userId =
        req.userId;

      const {
        conversationId,
        messageId,
      } = req.params;

      const {
        content,
      } = req.body;

      if (
        !content?.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Message content is required.",
          });
      }

      // ===================================
      // FIND USER-OWNED CONVERSATION
      // ===================================

      const conversation =
        await Conversation.findOne({
          _id:
            conversationId,

          userId,
        });

      if (!conversation) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Conversation not found.",
          });
      }

      // ===================================
      // FIND MESSAGE
      // ===================================

      const messageIndex =
        conversation.messages
          .findIndex(
            (message) =>
              message._id
                .toString() ===
              messageId
          );

      if (
        messageIndex === -1
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Message not found.",
          });
      }

      const userMessage =
        conversation.messages[
          messageIndex
        ];

      // Only user messages
      // can be edited.
      if (
        userMessage.role !==
        "user"
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Only user messages can be edited.",
          });
      }

      // ===================================
      // UPDATE USER MESSAGE
      // ===================================

      const trimmedContent =
        content.trim();

      userMessage.content =
        trimmedContent;

      // null = All Documents belonging
      // to THIS authenticated user.
      const document =
        conversation.document ||
        null;

      // ===================================
      // REGENERATE ANSWER
      //
      // IMPORTANT:
      // Pass userId into RAG.
      // ===================================

      const result =
        await askQuestion(
          trimmedContent,
          document,
          userId
        );

      // ===================================
      // UPDATE ASSISTANT RESPONSE
      // ===================================

      const nextMessage =
        conversation.messages[
          messageIndex + 1
        ];

      if (
        nextMessage &&
        nextMessage.role ===
          "assistant"
      ) {
        nextMessage.content =
          result.answer;

        nextMessage.sources =
          result.sources ||
          [];
      } else {
        conversation.messages
          .splice(
            messageIndex + 1,
            0,
            {
              role:
                "assistant",

              content:
                result.answer,

              sources:
                result.sources ||
                [],
            }
          );
      }

      conversation.markModified(
        "messages"
      );

      await conversation.save();

      return res.json({
        success: true,

        message:
          "Message edited and response regenerated successfully.",

        conversation,
      });
    } catch (error) {
      console.error(
        "Edit conversation message error:",
        error
      );

      return res
        .status(500)
        .json({
          success: false,

          message:
            error.message ||
            "Failed to edit message.",
        });
    }
  };

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  getConversations,
  getConversation,
  deleteConversation,
  clearConversation,
  editConversationMessage,
};