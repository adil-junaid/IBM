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
  listDocuments,
  removeDocument,
} = require(
  "../controllers/document.controller"
);

// ========================================
// ALL DOCUMENT ROUTES REQUIRE LOGIN
// ========================================

router.use(
  requireAuthentication
);

// ========================================
// GET LOGGED-IN USER'S DOCUMENTS
// ========================================

router.get(
  "/",
  listDocuments
);

// ========================================
// DELETE LOGGED-IN USER'S DOCUMENT
// ========================================

router.delete(
  "/:name",
  removeDocument
);

module.exports =
  router;