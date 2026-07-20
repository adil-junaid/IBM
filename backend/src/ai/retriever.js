const DocumentChunk = require(
  "../models/documentChunk.model"
);

const {
  generateEmbedding,
} = require(
  "../services/embedding.service"
);

/**
 * Calculate cosine similarity between two vectors.
 *
 * Higher score = more similar.
 */
function cosineSimilarity(vectorA, vectorB) {
  if (
    !Array.isArray(vectorA) ||
    !Array.isArray(vectorB) ||
    vectorA.length !== vectorB.length
  ) {
    return -1;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];

    magnitudeA +=
      vectorA[i] * vectorA[i];

    magnitudeB +=
      vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (magnitudeA * magnitudeB)
  );
}

/**
 * Retrieve relevant document chunks
 * from persistent MongoDB storage.
 */
async function retrieveRelevantChunks(
  question,
  documentName = null
) {
  if (
    !question ||
    typeof question !== "string"
  ) {
    throw new Error(
      "Question is required for retrieval."
    );
  }

  // =====================================
  // 1. Generate embedding for question
  // =====================================

  const questionEmbedding =
    await generateEmbedding(question);

  if (
    !Array.isArray(questionEmbedding) ||
    questionEmbedding.length !== 384
  ) {
    throw new Error(
      "Invalid question embedding."
    );
  }

  // =====================================
  // 2. Build MongoDB query
  // =====================================

  const query = {};

  // If a specific document is selected,
  // search only chunks from that document.
  if (documentName) {
    query.documentName = documentName;
  }

  // =====================================
  // 3. Load persistent document chunks
  // =====================================

  const storedChunks =
    await DocumentChunk.find(query).lean();

  if (storedChunks.length === 0) {
    return [];
  }

  // =====================================
  // 4. Calculate cosine similarity
  // =====================================

  const scoredChunks =
    storedChunks
      .filter(
        (chunk) =>
          Array.isArray(
            chunk.embedding
          ) &&
          chunk.embedding.length ===
            questionEmbedding.length
      )
      .map((chunk) => ({
        chunk,
        score: cosineSimilarity(
          questionEmbedding,
          chunk.embedding
        ),
      }));

  // =====================================
  // 5. Sort by similarity
  // =====================================

  scoredChunks.sort(
    (a, b) =>
      b.score - a.score
  );

  // =====================================
  // 6. Select top relevant chunks
  // =====================================

  const topChunks =
    scoredChunks.slice(
      0,
      documentName ? 4 : 5
    );

  // =====================================
  // 7. Convert MongoDB chunks into
  //    LangChain-like document objects.
  //
  // rag.service.js and prompt.js already
  // expect pageContent + metadata.
  // =====================================

  return topChunks.map(
    ({ chunk, score }) => ({
      pageContent: chunk.content,

      metadata: {
        ...(chunk.metadata || {}),

        source:
          chunk.documentName,

        pages:
          chunk.pages,

        chunk:
          chunk.chunkIndex + 1,

        similarityScore:
          score,
      },
    })
  );
}

module.exports = {
  retrieveRelevantChunks,
};