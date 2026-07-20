const Chat = require("../models/Chat");

/**
 * Get all chat history.
 */
const getChatHistory = async (
  req,
  res
) => {
  try {
    const chats =
      await Chat.find()
        .sort({
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

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch chat history.",
    });
  }
};

/**
 * Delete one chat.
 */
const deleteChat = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    const chat =
      await Chat.findByIdAndDelete(
        id
      );

    if (!chat) {
      return res.status(404).json({
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

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete chat.",
    });
  }
};

/**
 * Delete all chat history.
 */
const clearChatHistory = async (
  req,
  res
) => {
  try {
    await Chat.deleteMany({});

    return res.json({
      success: true,
      message:
        "Chat history cleared successfully.",
    });
  } catch (error) {
    console.error(
      "Clear history error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to clear chat history.",
    });
  }
};

module.exports = {
  getChatHistory,
  deleteChat,
  clearChatHistory,
};