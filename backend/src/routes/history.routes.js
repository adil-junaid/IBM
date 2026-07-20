const express =
  require("express");

const router =
  express.Router();

const {
  getChatHistory,
  deleteChat,
  clearChatHistory,
} = require(
  "../controllers/history.controller"
);

// Get history
router.get(
  "/",
  getChatHistory
);

// Delete all history
router.delete(
  "/",
  clearChatHistory
);

// Delete one chat
router.delete(
  "/:id",
  deleteChat
);

module.exports =
  router;