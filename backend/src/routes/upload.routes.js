const express = require(
  "express"
);

const router =
  express.Router();

const upload = require(
  "../middleware/upload.middleware"
);

const {
  requireAuthentication,
} = require(
  "../middleware/auth.middleware"
);

const uploadController =
  require(
    "../controllers/upload.controller"
  );

// ========================================
// POST /api/upload
//
// Clerk authentication is checked BEFORE
// Multer processes the uploaded file.
// ========================================

router.post(
  "/",

  requireAuthentication,

  upload.single(
    "document"
  ),

  uploadController
    .uploadDocument
);

module.exports =
  router;