const express = require("express");

const router = express.Router();

const {
  chatWithDocument,
  streamChatWithDocument,
} = require(
  "../controllers/chat.controller"
);

// Normal chat
router.post(
  "/",
  chatWithDocument
);

// Streaming chat
router.post(
  "/stream",
  streamChatWithDocument
);

module.exports = router;