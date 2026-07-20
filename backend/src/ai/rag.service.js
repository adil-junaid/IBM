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
 */
function getUniqueSources(docs) {
  const sourceMap =
    new Map();

  for (const doc of docs) {
    const documentName =
      doc.metadata?.source;

    if (!documentName) {
      continue;
    }

    if (
      !sourceMap.has(
        documentName
      )
    ) {
      sourceMap.set(
        documentName,
        {
          document:
            documentName,

          page:
            doc.metadata
              ?.pages,

          chunk:
            doc.metadata
              ?.chunk,
        }
      );
    }
  }

  return Array.from(
    sourceMap.values()
  );
}

/**
 * Normal non-streaming RAG.
 *
 * userId is required so retrieval
 * only searches documents belonging
 * to the authenticated Clerk user.
 */
async function askQuestion(
  question,
  documentName = null,
  userId
) {
  if (!userId) {
    throw new Error(
      "userId is required for secure RAG retrieval."
    );
  }

  const startTime =
    Date.now();

  // =====================================
  // RETRIEVAL
  // =====================================

  const retrievalStart =
    Date.now();

  const docs =
    await retrieveRelevantChunks(
      question,
      documentName,
      userId
    );

  console.log(
    `Retrieval: ${
      Date.now() -
      retrievalStart
    }ms`
  );

  if (!docs.length) {
    return {
      answer:
        "I couldn't find relevant information in your uploaded documents.",

      sources: [],
    };
  }

  // =====================================
  // BUILD PROMPT
  // =====================================

  const prompt =
    buildPrompt(
      question,
      docs
    );

  // =====================================
  // GENERATE ANSWER
  // =====================================

  const llmStart =
    Date.now();

  const answer =
    await generateAnswer(
      prompt
    );

  console.log(
    `LLM generation: ${
      Date.now() -
      llmStart
    }ms`
  );

  console.log(
    `Total RAG: ${
      Date.now() -
      startTime
    }ms`
  );

  return {
    answer,

    sources:
      getUniqueSources(
        docs
      ),
  };
}

/**
 * Streaming RAG.
 *
 * userId is required so retrieval
 * only searches documents belonging
 * to the authenticated Clerk user.
 */
async function streamQuestion(
  question,
  documentName = null,
  userId,
  onChunk
) {
  if (!userId) {
    throw new Error(
      "userId is required for secure RAG retrieval."
    );
  }

  const docs =
    await retrieveRelevantChunks(
      question,
      documentName,
      userId
    );

  if (!docs.length) {
    onChunk(
      "I couldn't find relevant information in your uploaded documents."
    );

    return {
      sources: [],
    };
  }

  const prompt =
    buildPrompt(
      question,
      docs
    );

  await streamAnswer(
    prompt,
    onChunk
  );

  return {
    sources:
      getUniqueSources(
        docs
      ),
  };
}

module.exports = {
  askQuestion,
  streamQuestion,
};