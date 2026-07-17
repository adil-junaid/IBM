const { retrieveRelevantChunks } = require("./retriever");
const { buildPrompt } = require("./prompt");
const { generateAnswer } = require("./llm");

async function askQuestion(question, documentName = null) {
  const docs = await retrieveRelevantChunks(
  question,
  documentName
);

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