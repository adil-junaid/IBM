const {
  getDocuments,
  deleteDocument,
} = require("../ai/documentRegistry");

const {
  deleteVectorStore,
} = require("../ai/vectorStore");

const listDocuments = (req, res) => {
  return res.json({
    success: true,
    count: getDocuments().length,
    documents: getDocuments(),
  });
};

const removeDocument = (req, res) => {
  const { name } = req.params;

  const removed = deleteDocument(name);

  if (!removed) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }

  deleteVectorStore(name);

  return res.json({
    success: true,
    message: "Document deleted successfully",
  });
};

module.exports = {
  listDocuments,
  removeDocument,
};