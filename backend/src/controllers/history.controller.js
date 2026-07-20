const Chat = require(
  "../models/Chat"
);

// ========================================
// GET CURRENT USER'S CHAT HISTORY
// ========================================

const getChatHistory = async (
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

    // Only return chats belonging
    // to the authenticated Clerk user.
    const chats =
      await Chat.find({
        userId,
      }).sort({
        createdAt: -1,
      });

    return res.json({
      success: true,

      chats,
    });
  } catch (error) {
    console.error(
      "Get chat history error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to fetch chat history.",
      });
  }
};

// ========================================
// DELETE ONE USER-OWNED CHAT
// ========================================

const deleteChat = async (
  req,
  res
) => {
  try {
    const userId =
      req.userId;

    const {
      id,
    } = req.params;

    // SECURITY:
    // Delete only when BOTH the chat ID
    // and authenticated user ID match.
    const chat =
      await Chat
        .findOneAndDelete({
          _id: id,

          userId,
        });

    if (!chat) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Chat not found.",
        });
    }

    return res.json({
      success: true,

      message:
        "Chat deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete chat error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to delete chat.",
      });
  }
};

// ========================================
// DELETE CURRENT USER'S ENTIRE HISTORY
// ========================================

const clearChatHistory = async (
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

    // IMPORTANT:
    // Never use Chat.deleteMany({})
    // because that would delete every
    // user's history.
    const result =
      await Chat.deleteMany({
        userId,
      });

    return res.json({
      success: true,

      message:
        "Chat history cleared successfully.",

      deletedCount:
        result.deletedCount,
    });
  } catch (error) {
    console.error(
      "Clear history error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to clear chat history.",
      });
  }
};

module.exports = {
  getChatHistory,
  deleteChat,
  clearChatHistory,
};