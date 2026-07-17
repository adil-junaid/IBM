function buildPrompt(question, documents) {
  const context = documents
    .map((doc) => doc.pageContent)
    .join("\n\n----------------\n\n");

  return `
You are an AI Research Assistant.

Answer ONLY using the provided context.

If the answer is not present in the context, reply:
"I couldn't find that information in the uploaded document."

Context:
${context}

Question:
${question}

Answer:
`;
}

module.exports = {
  buildPrompt,
};