const express =
  require("express");

const router =
  express.Router();

const {
  requireAuthentication,
} = require(
  "../middleware/auth.middleware"
);

const {
  getConversations,
  getConversation,
  deleteConversation,
  clearConversation,
  editConversationMessage,
} = require(
  "../controllers/conversation.controller"
);

// ========================================
// ALL CONVERSATION ROUTES REQUIRE LOGIN
// ========================================

router.use(
  requireAuthentication
);

// GET all conversations for current user
router.get(
  "/",
  getConversations
);

// GET one conversation owned by current user
router.get(
  "/:conversationId",
  getConversation
);

// DELETE conversation owned by current user
router.delete(
  "/:conversationId",
  deleteConversation
);

// CLEAR messages in user's conversation
router.delete(
  "/:conversationId/messages",
  clearConversation
);

// EDIT user message and regenerate answer
router.put(
  "/:conversationId/messages/:messageId",
  editConversationMessage
);

module.exports =
  router;