const { getVectorStore, getAllVectorStores } = require("./vectorStore");

async function retrieveRelevantChunks(question, documentName = null) {

  if (documentName) {
    const store = getVectorStore(documentName);

    return await store.similaritySearch(question, 5);
  }

  const stores = getAllVectorStores();

  let docs = [];

  for (const store of Object.values(stores)) {
    const results = await store.similaritySearch(question, 5);
    docs.push(...results);
  }

  return docs;
}

module.exports = {
  retrieveRelevantChunks,
};