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
  getChatHistory,
  deleteChat,
  clearChatHistory,
} = require(
  "../controllers/history.controller"
);

// ========================================
// ALL HISTORY ROUTES REQUIRE LOGIN
// ========================================

router.use(
  requireAuthentication
);

// GET current user's history
router.get(
  "/",
  getChatHistory
);

// DELETE all history belonging
// to current user
router.delete(
  "/",
  clearChatHistory
);

// DELETE one chat belonging
// to current user
router.delete(
  "/:id",
  deleteChat
);

module.exports =
  router;