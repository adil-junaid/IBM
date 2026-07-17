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

/**
 * Delete a document by name.
 */
function deleteDocument(name) {
  const index = uploadedDocuments.findIndex(
    (doc) => doc.name === name
  );

  if (index === -1) {
    return false;
  }

  uploadedDocuments.splice(index, 1);
  return true;
}

module.exports = {
  registerDocument,
  getDocuments,
  deleteDocument,
};