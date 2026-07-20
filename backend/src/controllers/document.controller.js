const fs = require(
  "fs"
);

const Document = require(
  "../models/document.model"
);

const DocumentChunk = require(
  "../models/documentChunk.model"
);

// ========================================
// GET LOGGED-IN USER'S DOCUMENTS
// ========================================

const listDocuments = async (
  req,
  res
) => {
  try {
    // =====================================
    // GET AUTHENTICATED CLERK USER
    // =====================================

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

    // =====================================
    // TEMPORARY DEBUG LOG
    //
    // This lets us verify which Clerk
    // account is requesting documents.
    // =====================================

    console.log(
      "📄 Fetching documents for Clerk user:",
      userId
    );

    // =====================================
    // FETCH ONLY THIS USER'S DOCUMENTS
    //
    // SECURITY:
    // Never use Document.find() here.
    //
    // Every query must include userId.
    // =====================================

    const documents =
      await Document.find({
        userId,
      }).sort({
        uploadedAt: -1,
      });

    // =====================================
    // TEMPORARY DEBUG LOG
    //
    // Shows exactly which documents
    // MongoDB returned and their owners.
    // =====================================

    console.log(
      "📄 Documents returned:",
      documents.map(
        (document) => ({
          name:
            document.originalName,

          owner:
            document.userId,

          id:
            document._id.toString(),
        })
      )
    );

    // =====================================
    // RETURN USER'S DOCUMENTS
    // =====================================

    return res.json({
      success: true,

      count:
        documents.length,

      documents,
    });
  } catch (error) {
    console.error(
      "List documents error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to fetch documents.",
      });
  }
};

// ========================================
// DELETE LOGGED-IN USER'S DOCUMENT
// ========================================

const removeDocument = async (
  req,
  res
) => {
  try {
    // =====================================
    // GET AUTHENTICATED CLERK USER
    // =====================================

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

    const {
      name,
    } = req.params;

    if (!name) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Document name is required.",
        });
    }

    const decodedName =
      decodeURIComponent(
        name
      );

    // =====================================
    // DEBUG LOG
    // =====================================

    console.log(
      "🗑️ Delete document request:",
      {
        userId,
        document:
          decodedName,
      }
    );

    // =====================================
    // FIND DOCUMENT + VERIFY OWNERSHIP
    //
    // Both fields must match:
    //
    // 1. userId
    // 2. originalName
    //
    // This prevents User A from deleting
    // User B's document.
    // =====================================

    const document =
      await Document.findOne({
        userId,

        originalName:
          decodedName,
      });

    if (!document) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Document not found.",
        });
    }

    // =====================================
    // DELETE DOCUMENT CHUNKS
    //
    // Delete only chunks belonging to:
    //
    // - authenticated user
    // - specific MongoDB document
    // =====================================

    const chunkDeleteResult =
      await DocumentChunk
        .deleteMany({
          userId,

          documentId:
            document._id,
        });

    console.log(
      "🗑️ Deleted document chunks:",
      chunkDeleteResult
        .deletedCount
    );

    // =====================================
    // DELETE PHYSICAL FILE
    // =====================================

    if (
      document.filePath &&
      fs.existsSync(
        document.filePath
      )
    ) {
      try {
        fs.unlinkSync(
          document.filePath
        );

        console.log(
          "🗑️ Physical file deleted:",
          document.filePath
        );
      } catch (
        fileError
      ) {
        // Do not fail the entire database
        // deletion if physical file cleanup
        // fails.
        console.error(
          "Failed to delete physical file:",
          fileError
        );
      }
    }

    // =====================================
    // DELETE DOCUMENT METADATA
    //
    // Verify ownership again during delete.
    // =====================================

    const deletedDocument =
      await Document
        .findOneAndDelete({
          _id:
            document._id,

          userId,
        });

    if (!deletedDocument) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            "Document not found or access denied.",
        });
    }

    console.log(
      "✅ Document deleted:",
      {
        userId,

        document:
          document.originalName,

        documentId:
          document._id.toString(),
      }
    );

    // =====================================
    // RETURN SUCCESS
    // =====================================

    return res.json({
      success: true,

      message:
        "Document deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete document error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to delete document.",
      });
  }
};

// ========================================
// EXPORT CONTROLLERS
// ========================================

module.exports = {
  listDocuments,
  removeDocument,
};