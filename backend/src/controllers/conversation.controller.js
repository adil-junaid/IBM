const Conversation = require(
  "../models/conversation.model"
);

const {
  askQuestion,
} = require("../ai/rag.service");


// ========================================
// GET ALL CONVERSATIONS
// ========================================

const getConversations = async (
  req,
  res
) => {
  try {
    const conversations =
      await Conversation.find()
        .sort({
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

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch conversations.",
    });
  }
};


// ========================================
// GET ONE CONVERSATION
// ========================================

const getConversation = async (
  req,
  res
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
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

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch conversation.",
    });
  }
};


// ========================================
// DELETE CONVERSATION
// ========================================

const deleteConversation = async (
  req,
  res
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const conversation =
      await Conversation.findByIdAndDelete(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
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

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete conversation.",
    });
  }
};


// ========================================
// CLEAR CONVERSATION MESSAGES
// ========================================

const clearConversation = async (
  req,
  res
) => {
  try {
    const {
      conversationId,
    } = req.params;

    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message:
          "Conversation not found.",
      });
    }

    conversation.messages = [];

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

    return res.status(500).json({
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

const editConversationMessage = async (
  req,
  res
) => {
  try {
    const {
      conversationId,
      messageId,
    } = req.params;

    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Message content is required.",
      });
    }

    // Find conversation
    const conversation =
      await Conversation.findById(
        conversationId
      );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message:
          "Conversation not found.",
      });
    }

    // Find the user message
    const messageIndex =
      conversation.messages.findIndex(
        (message) =>
          message._id.toString() ===
          messageId
      );

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message:
          "Message not found.",
      });
    }

    const userMessage =
      conversation.messages[
        messageIndex
      ];

    // Only user messages can be edited
    if (
      userMessage.role !== "user"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only user messages can be edited.",
      });
    }

    // Update the user message
    userMessage.content =
      content.trim();

    // Get selected document
    const document =
      conversation.document ||
      null;

    // Generate a new answer
    // for the edited question
    const result =
      await askQuestion(
        content.trim(),
        document
      );

    /*
     * Normally the assistant response
     * immediately follows the user message.
     *
     * Example:
     *
     * index 0 -> user question 1
     * index 1 -> assistant answer 1
     * index 2 -> user question 2
     * index 3 -> assistant answer 2
     */

    const nextMessage =
      conversation.messages[
        messageIndex + 1
      ];

    if (
      nextMessage &&
      nextMessage.role ===
        "assistant"
    ) {
      // Replace ONLY the answer belonging
      // to the edited question
      nextMessage.content =
        result.answer;

      nextMessage.sources =
        result.sources || [];
    } else {
      /*
       * If no assistant response exists
       * after this question, insert one
       * without deleting later messages.
       */
      conversation.messages.splice(
        messageIndex + 1,
        0,
        {
          role: "assistant",
          content:
            result.answer,
          sources:
            result.sources ||
            [],
        }
      );
    }

    // Tell Mongoose that the nested
    // messages array was modified
    conversation.markModified(
      "messages"
    );

    // Save updated conversation
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

    return res.status(500).json({
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