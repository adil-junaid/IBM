const express =
  require("express");

const router =
  express.Router();

const {
  getConversations,
  getConversation,
  deleteConversation,
  clearConversation,
  editConversationMessage,
} = require(
  "../controllers/conversation.controller"
);

router.get(
  "/",
  getConversations
);

router.get(
  "/:conversationId",
  getConversation
);

router.delete(
  "/:conversationId",
  deleteConversation
);

router.delete(
  "/:conversationId/messages",
  clearConversation
);

// Edit user message
router.put(
  "/:conversationId/messages/:messageId",
  editConversationMessage
);

module.exports = router;
