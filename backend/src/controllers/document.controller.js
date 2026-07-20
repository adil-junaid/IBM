const fs = require("fs");

const Document = require(
  "../models/document.model"
);

const DocumentChunk = require(
  "../models/documentChunk.model"
);

// ========================================
// GET ALL UPLOADED DOCUMENTS
// ========================================

const listDocuments = async (
  req,
  res
) => {
  try {
    const documents =
      await Document.find()
        .sort({
          uploadedAt: -1,
        });

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

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to fetch documents.",
    });
  }
};

// ========================================
// DELETE DOCUMENT
// ========================================

const removeDocument = async (
  req,
  res
) => {
  try {
    const {
      name,
    } = req.params;

    const decodedName =
      decodeURIComponent(
        name
      );

    // Find document by its
    // original uploaded filename
    const document =
      await Document.findOne({
        originalName:
          decodedName,
      });

    if (!document) {
      return res.status(404).json({
        success: false,

        message:
          "Document not found.",
      });
    }

    // ====================================
    // Delete document chunks and
    // embeddings from MongoDB Atlas
    // ====================================

    await DocumentChunk.deleteMany({
      source:
        document.originalName,
    });

    // ====================================
    // Delete physical file if it exists
    // ====================================

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
      } catch (
        fileError
      ) {
        console.error(
          "Failed to delete physical file:",
          fileError
        );
      }
    }

    // ====================================
    // Delete document metadata record
    // ====================================

    await Document.findByIdAndDelete(
      document._id
    );

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

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to delete document.",
    });
  }
};

module.exports = {
  listDocuments,
  removeDocument,
};