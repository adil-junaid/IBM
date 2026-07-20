const fs = require("fs");

const Document = require("../models/document.model");

const {
  indexDocument,
} = require("../ai/documentStore");

const {
  chunkText,
} = require("../services/chunk.service");

const {
  parseDocument,
} = require("../services/parser.service");

const uploadDocument = async (req, res) => {
  let document = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // =====================================
    // 1. Parse uploaded document
    // =====================================

    const parsedData = await parseDocument(
      req.file.path
    );

    // =====================================
    // 2. Split document into chunks
    // =====================================

    const chunks = chunkText(
      parsedData.text
    );

    if (!chunks || chunks.length === 0) {
      throw new Error(
        "No text chunks could be generated from the document."
      );
    }

    // =====================================
    // 3. Save permanent document metadata
    //    FIRST so we have a documentId
    // =====================================

    document = await Document.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileType: req.file.mimetype,
      filePath: req.file.path,
      pages: parsedData.pages || 0,
      chunks: chunks.length,
      uploadedAt: new Date(),
    });

    // =====================================
    // 4. Generate Hugging Face embeddings
    //    and persist chunks in MongoDB
    // =====================================

    const indexedChunks = await indexDocument(
      chunks,
      {
        source: req.file.originalname,
        storedName: req.file.filename,
        pages: parsedData.pages,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        uploadedAt:
          new Date().toISOString(),
        metadata:
          parsedData.metadata,
      },
      document._id
    );

    // =====================================
    // 5. Return success
    // =====================================

    return res.status(200).json({
      success: true,

      message:
        "Document indexed and stored successfully!",

      document,

      originalName:
        req.file.originalname,

      fileName:
        req.file.filename,

      pages:
        parsedData.pages,

      metadata:
        parsedData.metadata,

      totalChunks:
        chunks.length,

      indexedChunks,
    });
  } catch (error) {
    console.error(
      "Upload document error:",
      error
    );

    // If the MongoDB Document record was created
    // but embedding/indexing failed, remove it.
    if (document?._id) {
      try {
        await Document.findByIdAndDelete(
          document._id
        );
      } catch (dbError) {
        console.error(
          "Failed to clean up document record:",
          dbError
        );
      }
    }

    // Remove uploaded physical file if processing fails.
    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      try {
        fs.unlinkSync(
          req.file.path
        );
      } catch (fileError) {
        console.error(
          "Failed to remove uploaded file:",
          fileError
        );
      }
    }

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to upload document.",
    });
  }
};

module.exports = {
  uploadDocument,
};