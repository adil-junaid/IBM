const { parseDocument } = require("../services/parser.service");

const uploadDocument = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Parse the uploaded document
    const parsedData = await parseDocument(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Document processed successfully!",
      originalName: req.file.originalname,
      fileName: req.file.filename,
      pages: parsedData.pages,
      metadata: parsedData.metadata,
      text: parsedData.text,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
};