const { retrieveRelevantChunks } = require("./retriever");
const { buildPrompt } = require("./prompt");
const { generateAnswer } = require("./llm");

async function askQuestion(question) {
  const docs = await retrieveRelevantChunks(question);

  const prompt = buildPrompt(question, docs);

  const answer = await generateAnswer(prompt);

  return {
    answer,
    sources: docs.map((doc) => ({
      document: doc.metadata.source,
      page: doc.metadata.pages,
      chunk: doc.metadata.chunk,
    })),
  };
}

module.exports = {
  askQuestion,
};