const fs = require("fs");

const Document = require(
  "../models/document.model"
);

const {
  indexDocument,
} = require(
  "../ai/documentStore"
);

const {
  chunkText,
} = require(
  "../services/chunk.service"
);

const {
  parseDocument,
} = require(
  "../services/parser.service"
);

const uploadDocument = async (
  req,
  res
) => {
  let document = null;

  try {
    // =====================================
    // AUTHENTICATED USER
    // =====================================

    const userId =
      req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No file uploaded.",
      });
    }

    // =====================================
    // 1. Parse uploaded document
    // =====================================

    const parsedData =
      await parseDocument(
        req.file.path
      );

    // =====================================
    // 2. Split document into chunks
    // =====================================

    const chunks =
      chunkText(
        parsedData.text
      );

    if (
      !chunks ||
      chunks.length === 0
    ) {
      throw new Error(
        "No text chunks could be generated from the document."
      );
    }

    // =====================================
    // 3. Save document metadata
    //
    // IMPORTANT:
    // Document belongs to logged-in user.
    // =====================================

    document =
      await Document.create({
        userId,

        originalName:
          req.file.originalname,

        fileName:
          req.file.filename,

        fileType:
          req.file.mimetype,

        filePath:
          req.file.path,

        pages:
          parsedData.pages ||
          0,

        chunks:
          chunks.length,

        uploadedAt:
          new Date(),
      });

    // =====================================
    // 4. Generate embeddings
    //
    // Pass userId through the entire
    // indexing pipeline.
    // =====================================

    const indexedChunks =
      await indexDocument(
        chunks,
        {
          source:
            req.file.originalname,

          storedName:
            req.file.filename,

          pages:
            parsedData.pages,

          fileSize:
            req.file.size,

          fileType:
            req.file.mimetype,

          uploadedAt:
            new Date()
              .toISOString(),

          metadata:
            parsedData.metadata,
        },

        document._id,

        userId
      );

    // =====================================
    // 5. Return success
    // =====================================

    return res
      .status(200)
      .json({
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

    // =====================================
    // Clean up MongoDB record
    // =====================================

    if (document?._id) {
      try {
        await Document
          .findOneAndDelete({
            _id:
              document._id,

            userId:
              req.userId,
          });
      } catch (dbError) {
        console.error(
          "Failed to clean up document record:",
          dbError
        );
      }
    }

    // =====================================
    // Clean up physical file
    // =====================================

    if (
      req.file?.path &&
      fs.existsSync(
        req.file.path
      )
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

    return res
      .status(500)
      .json({
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