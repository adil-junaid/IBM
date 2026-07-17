const uploadedDocuments = [];

/**
 * Register an uploaded document.
 */
function registerDocument(document) {
  uploadedDocuments.push(document);
}

/**
 * Get all uploaded documents.
 */
function getDocuments() {
  return uploadedDocuments;
}

module.exports = {
  registerDocument,
  getDocuments,
};