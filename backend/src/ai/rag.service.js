const {
  retrieveRelevantChunks,
} = require("./retriever");

const {
  buildPrompt,
} = require("./prompt");

const {
  generateAnswer,
  streamAnswer,
} = require("./llm");

/**
 * Build a clean, deduplicated source list.
 *
 * Multiple chunks may come from the same document,
 * but the document should only appear once in the UI.
 */
function getUniqueSources(docs) {
  const sourceMap = new Map();

  for (const doc of docs) {
    const documentName =
      doc.metadata?.source;

    if (!documentName) {
      continue;
    }

    // Only add the document once
    if (!sourceMap.has(documentName)) {
      sourceMap.set(documentName, {
        document: documentName,
        page: doc.metadata?.pages,
        chunk: doc.metadata?.chunk,
      });
    }
  }

  return Array.from(
    sourceMap.values()
  );
}

/**
 * Normal non-streaming RAG.
 */
async function askQuestion(
  question,
  documentName = null
) {
  const startTime = Date.now();

  // ==============================
  // RETRIEVAL
  // ==============================
  const retrievalStart = Date.now();

  const docs =
    await retrieveRelevantChunks(
      question,
      documentName
    );

  console.log(
    `Retrieval: ${
      Date.now() - retrievalStart
    }ms`
  );

  if (!docs.length) {
    return {
      answer:
        "I couldn't find relevant information in the uploaded documents.",
      sources: [],
    };
  }

  // ==============================
  // BUILD PROMPT
  // ==============================
  const prompt = buildPrompt(
    question,
    docs
  );

  // ==============================
  // GENERATE ANSWER
  // ==============================
  const llmStart = Date.now();

  const answer =
    await generateAnswer(prompt);

  console.log(
    `LLM generation: ${
      Date.now() - llmStart
    }ms`
  );

  console.log(
    `Total RAG: ${
      Date.now() - startTime
    }ms`
  );

  return {
    answer,

    // Remove duplicate document names
    sources: getUniqueSources(docs),
  };
}

/**
 * Streaming RAG.
 */
async function streamQuestion(
  question,
  documentName = null,
  onChunk
) {
  const docs =
    await retrieveRelevantChunks(
      question,
      documentName
    );

  if (!docs.length) {
    onChunk(
      "I couldn't find relevant information in the uploaded documents."
    );

    return {
      sources: [],
    };
  }

  const prompt = buildPrompt(
    question,
    docs
  );

  await streamAnswer(
    prompt,
    onChunk
  );

  return {
    // Remove duplicate document names
    sources: getUniqueSources(docs),
  };
}

module.exports = {
  askQuestion,
  streamQuestion,
};