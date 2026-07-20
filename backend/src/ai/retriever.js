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
function cosineSimilarity(
  vectorA,
  vectorB
) {
  if (
    !Array.isArray(vectorA) ||
    !Array.isArray(vectorB) ||
    vectorA.length !==
      vectorB.length
  ) {
    return -1;
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (
    let i = 0;
    i < vectorA.length;
    i++
  ) {
    dotProduct +=
      vectorA[i] *
      vectorB[i];

    magnitudeA +=
      vectorA[i] *
      vectorA[i];

    magnitudeB +=
      vectorB[i] *
      vectorB[i];
  }

  magnitudeA =
    Math.sqrt(magnitudeA);

  magnitudeB =
    Math.sqrt(magnitudeB);

  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (magnitudeA *
      magnitudeB)
  );
}

/**
 * Normalize a filename for comparison.
 *
 * Example:
 * "FusionX.pdf" -> "fusionx.pdf"
 */
function normalizeFileName(
  fileName
) {
  if (
    !fileName ||
    typeof fileName !==
      "string"
  ) {
    return "";
  }

  return fileName
    .trim()
    .toLowerCase();
}

/**
 * Try to detect whether the user
 * explicitly mentioned an uploaded
 * document in the question.
 *
 * Example:
 *
 * Question:
 * "What are the contents in FusionX.pdf?"
 *
 * Result:
 * "FusionX.pdf"
 */
async function detectDocumentFromQuestion(
  question
) {
  // Get unique uploaded document names
  // from persistent MongoDB chunks.
  const documentNames =
    await DocumentChunk.distinct(
      "documentName"
    );

  if (
    !documentNames ||
    documentNames.length === 0
  ) {
    return null;
  }

  const normalizedQuestion =
    question.toLowerCase();

  // =====================================
  // First try:
  // Exact filename match
  //
  // Example:
  // FusionX.pdf
  // =====================================

  for (
    const documentName
    of documentNames
  ) {
    const normalizedName =
      normalizeFileName(
        documentName
      );

    if (
      normalizedName &&
      normalizedQuestion.includes(
        normalizedName
      )
    ) {
      return documentName;
    }
  }

  // =====================================
  // Second try:
  // Match filename without extension
  //
  // Example:
  // "Tell me about FusionX"
  // should match:
  // FusionX.pdf
  // =====================================

  for (
    const documentName
    of documentNames
  ) {
    const normalizedName =
      normalizeFileName(
        documentName
      );

    const nameWithoutExtension =
      normalizedName.replace(
        /\.[^/.]+$/,
        ""
      );

    // Avoid matching very short
    // generic filenames.
    if (
      nameWithoutExtension.length >=
        4 &&
      normalizedQuestion.includes(
        nameWithoutExtension
      )
    ) {
      return documentName;
    }
  }

  return null;
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
    typeof question !==
      "string"
  ) {
    throw new Error(
      "Question is required for retrieval."
    );
  }

  // =====================================
  // 1. Determine active document
  // =====================================
  //
  // Priority:
  //
  // 1. Explicitly selected document
  // 2. Filename mentioned in question
  // 3. All documents
  // =====================================

  let activeDocument =
    documentName;

  if (!activeDocument) {
    activeDocument =
      await detectDocumentFromQuestion(
        question
      );
  }

  if (activeDocument) {
    console.log(
      `Retrieving from document: ${activeDocument}`
    );
  } else {
    console.log(
      "Retrieving from all documents"
    );
  }

  // =====================================
  // 2. Generate embedding for question
  // =====================================

  const questionEmbedding =
    await generateEmbedding(
      question
    );

  if (
    !Array.isArray(
      questionEmbedding
    ) ||
    questionEmbedding.length !==
      384
  ) {
    throw new Error(
      "Invalid question embedding."
    );
  }

  // =====================================
  // 3. Build MongoDB query
  // =====================================

  const query = {};

  if (activeDocument) {
    query.documentName =
      activeDocument;
  }

  // =====================================
  // 4. Load persistent document chunks
  // =====================================

  const storedChunks =
    await DocumentChunk.find(
      query
    ).lean();

  if (
    storedChunks.length === 0
  ) {
    return [];
  }

  // =====================================
  // 5. Calculate cosine similarity
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
      .map(
        (chunk) => ({
          chunk,

          score:
            cosineSimilarity(
              questionEmbedding,
              chunk.embedding
            ),
        })
      );

  // =====================================
  // 6. Sort by similarity
  // =====================================

  scoredChunks.sort(
    (a, b) =>
      b.score - a.score
  );

  // =====================================
  // 7. Select top relevant chunks
  // =====================================

  const topChunks =
    scoredChunks.slice(
      0,
      activeDocument
        ? 6
        : 5
    );

  // Log retrieved chunks
  // for debugging on Render.
  console.log(
    "Top retrieved chunks:",
    topChunks.map(
      ({ chunk, score }) => ({
        document:
          chunk.documentName,

        chunk:
          chunk.chunkIndex,

        score:
          Number(
            score.toFixed(4)
          ),
      })
    )
  );

  // =====================================
  // 8. Convert MongoDB chunks into
  //    LangChain-like document objects.
  // =====================================

  return topChunks.map(
    ({
      chunk,
      score,
    }) => ({
      pageContent:
        chunk.content,

      metadata: {
        ...(chunk.metadata ||
          {}),

        source:
          chunk.documentName,

        pages:
          chunk.pages,

        chunk:
          chunk.chunkIndex +
          1,

        similarityScore:
          score,
      },
    })
  );
}

module.exports = {
  retrieveRelevantChunks,
};