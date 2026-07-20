const express = require(
  "express"
);

const router =
  express.Router();

const {
  requireAuthentication,
} = require(
  "../middleware/auth.middleware"
);

const {
  chatWithDocument,
  streamChatWithDocument,
} = require(
  "../controllers/chat.controller"
);

// ========================================
// ALL CHAT ROUTES REQUIRE LOGIN
// ========================================

router.use(
  requireAuthentication
);

// ========================================
// NORMAL CHAT
//
// POST /api/chat
// ========================================

router.post(
  "/",
  chatWithDocument
);

// ========================================
// STREAMING CHAT
//
// POST /api/chat/stream
// ========================================

router.post(
  "/stream",
  streamChatWithDocument
);

module.exports = router;