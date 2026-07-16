const vectorStore = require("./vectorStore");

/**
 * Retrieve the most relevant document chunks.
 * @param {string} question
 * @returns {Promise<Array>}
 */
async function retrieveRelevantChunks(question) {
  const results = await vectorStore.similaritySearch(question, 3);
  return results;
}

module.exports = {
  retrieveRelevantChunks,
};