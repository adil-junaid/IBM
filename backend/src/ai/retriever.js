const DocumentChunk = require(
  "../models/documentChunk.model"
);

const {
  generateEmbedding,
} = require(
  "../services/embedding.service"
);

// ========================================
// CONFIGURATION
// ========================================

const MAX_CANDIDATES = 20;

const DEFAULT_TOP_K = 7;

const BROAD_TOP_K = 12;

const MAX_DOCUMENT_SUMMARY_CHUNKS =
  20;

// ========================================
// COSINE SIMILARITY
// ========================================

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
    (
      magnitudeA *
      magnitudeB
    )
  );
}

// ========================================
// TEXT NORMALIZATION
// ========================================

function normalizeText(text) {
  if (
    !text ||
    typeof text !== "string"
  ) {
    return "";
  }

  return text
    .toLowerCase()
    .trim();
}

// ========================================
// REMOVE FILE EXTENSION
// ========================================

function removeExtension(
  fileName
) {
  return normalizeText(
    fileName
  ).replace(
    /\.[^/.]+$/,
    ""
  );
}

// ========================================
// DETECT DOCUMENT FROM QUESTION
//
// SECURITY:
// Only checks document names belonging
// to the authenticated user.
// ========================================

async function detectDocumentFromQuestion(
  question,
  userId
) {
  if (!userId) {
    throw new Error(
      "userId is required for document detection."
    );
  }

  const documentNames =
    await DocumentChunk.distinct(
      "documentName",
      {
        userId,
      }
    );

  if (
    !documentNames ||
    documentNames.length === 0
  ) {
    return null;
  }

  const normalizedQuestion =
    normalizeText(question);

  // Exact filename detection
  //
  // Example:
  // "summarize FusionX.pdf"

  for (
    const documentName
    of documentNames
  ) {
    const normalizedName =
      normalizeText(
        documentName
      );

    if (
      normalizedQuestion.includes(
        normalizedName
      )
    ) {
      return documentName;
    }
  }

  // Filename without extension
  //
  // Example:
  // "tell me about FusionX"

  for (
    const documentName
    of documentNames
  ) {
    const baseName =
      removeExtension(
        documentName
      );

    if (
      baseName.length >= 4 &&
      normalizedQuestion.includes(
        baseName
      )
    ) {
      return documentName;
    }
  }

  return null;
}

// ========================================
// QUERY TYPE DETECTION
// ========================================

function detectQueryType(
  question
) {
  const q =
    normalizeText(question);

  const broadPatterns = [
    "summarize",
    "summary",
    "overview",
    "contents",
    "content of",
    "what is this document about",
    "what is the document about",
    "what does this document contain",
    "what does the file contain",
    "explain this document",
    "describe this document",
    "key points",
    "main points",
    "important points",
  ];

  if (
    broadPatterns.some(
      (pattern) =>
        q.includes(pattern)
    )
  ) {
    return "broad";
  }

  const comparisonPatterns = [
    "compare",
    "comparison",
    "difference between",
    "differences between",
    "similarities between",
    "versus",
    " vs ",
  ];

  if (
    comparisonPatterns.some(
      (pattern) =>
        q.includes(pattern)
    )
  ) {
    return "comparison";
  }

  const listPatterns = [
    "list all",
    "what are all",
    "which are",
    "give me all",
    "show all",
    "name all",
  ];

  if (
    listPatterns.some(
      (pattern) =>
        q.includes(pattern)
    )
  ) {
    return "list";
  }

  return "specific";
}

// ========================================
// TOKENIZE QUESTION
// ========================================

function getKeywords(text) {
  const stopWords =
    new Set([
      "what",
      "which",
      "where",
      "when",
      "who",
      "why",
      "how",
      "are",
      "is",
      "was",
      "were",
      "the",
      "a",
      "an",
      "and",
      "or",
      "of",
      "in",
      "on",
      "for",
      "to",
      "from",
      "with",
      "this",
      "that",
      "these",
      "those",
      "tell",
      "me",
      "give",
      "show",
      "please",
      "about",
      "used",
      "using",
      "use",
    ]);

  return normalizeText(text)
    .replace(
      /[^a-z0-9\s]/g,
      " "
    )
    .split(/\s+/)
    .filter(
      (word) =>
        word.length >= 3 &&
        !stopWords.has(word)
    );
}

// ========================================
// KEYWORD RELEVANCE SCORE
// ========================================

function calculateKeywordScore(
  question,
  content,
  documentName
) {
  const keywords =
    getKeywords(question);

  if (
    keywords.length === 0
  ) {
    return 0;
  }

  const normalizedContent =
    normalizeText(content);

  const normalizedDocument =
    normalizeText(
      documentName
    );

  let matches = 0;

  for (
    const keyword
    of keywords
  ) {
    if (
      normalizedContent.includes(
        keyword
      )
    ) {
      matches += 1;
    }

    if (
      normalizedDocument.includes(
        keyword
      )
    ) {
      matches += 0.5;
    }
  }

  return (
    matches /
    keywords.length
  );
}

// ========================================
// RERANK CANDIDATES
// ========================================

function rerankChunks(
  candidates,
  question
) {
  return candidates
    .map((candidate) => {
      const keywordScore =
        calculateKeywordScore(
          question,
          candidate.chunk.content,
          candidate.chunk
            .documentName
        );

      const finalScore =
        (
          candidate.score *
          0.8
        ) +
        (
          keywordScore *
          0.2
        );

      return {
        ...candidate,

        keywordScore,

        finalScore,
      };
    })
    .sort(
      (a, b) =>
        b.finalScore -
        a.finalScore
    );
}

// ========================================
// SELECT DIVERSE CHUNKS
// ========================================

function selectDiverseChunks(
  rankedChunks,
  limit
) {
  if (
    rankedChunks.length <=
    limit
  ) {
    return rankedChunks;
  }

  const selected = [];

  const documentCounts =
    new Map();

  for (
    const candidate
    of rankedChunks
  ) {
    const documentName =
      candidate.chunk
        .documentName;

    const count =
      documentCounts.get(
        documentName
      ) || 0;

    if (count < 3) {
      selected.push(
        candidate
      );

      documentCounts.set(
        documentName,
        count + 1
      );
    }

    if (
      selected.length >=
      limit
    ) {
      return selected;
    }
  }

  for (
    const candidate
    of rankedChunks
  ) {
    if (
      selected.includes(
        candidate
      )
    ) {
      continue;
    }

    selected.push(
      candidate
    );

    if (
      selected.length >=
      limit
    ) {
      break;
    }
  }

  return selected;
}

// ========================================
// RETRIEVE BROAD DOCUMENT CONTENT
//
// SECURITY:
// Requires both userId and documentName.
// ========================================

async function retrieveBroadDocument(
  documentName,
  userId
) {
  if (!userId) {
    throw new Error(
      "userId is required for document retrieval."
    );
  }

  const chunks =
    await DocumentChunk.find({
      userId,
      documentName,
    })
      .sort({
        chunkIndex: 1,
      })
      .lean();

  if (
    chunks.length === 0
  ) {
    return [];
  }

  if (
    chunks.length <=
    MAX_DOCUMENT_SUMMARY_CHUNKS
  ) {
    return chunks.map(
      (chunk) => ({
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
            null,

          retrievalType:
            "broad-document",
        },
      })
    );
  }

  const selected = [];

  const step =
    chunks.length /
    MAX_DOCUMENT_SUMMARY_CHUNKS;

  for (
    let i = 0;
    i <
    MAX_DOCUMENT_SUMMARY_CHUNKS;
    i++
  ) {
    const index =
      Math.floor(
        i * step
      );

    if (chunks[index]) {
      selected.push(
        chunks[index]
      );
    }
  }

  return selected.map(
    (chunk) => ({
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
          null,

        retrievalType:
          "broad-document",
      },
    })
  );
}

// ========================================
// MAIN RETRIEVAL FUNCTION
//
// IMPORTANT:
// userId is mandatory.
//
// All MongoDB queries are scoped to the
// authenticated Clerk user.
// ========================================

async function retrieveRelevantChunks(
  question,
  documentName = null,
  userId
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

  if (!userId) {
    throw new Error(
      "userId is required for secure retrieval."
    );
  }

  // =====================================
  // STEP 1:
  // Detect query intent
  // =====================================

  const queryType =
    detectQueryType(
      question
    );

  // =====================================
  // STEP 2:
  // Detect document mentioned in question
  //
  // Only searches filenames belonging
  // to this authenticated user.
  // =====================================

  const mentionedDocument =
    await detectDocumentFromQuestion(
      question,
      userId
    );

  // Explicit UI selection takes priority.
  const activeDocument =
    documentName ||
    mentionedDocument ||
    null;

  console.log(
    "RAG retrieval request:",
    {
      userId,

      question,

      queryType,

      selectedDocument:
        documentName,

      mentionedDocument,

      activeDocument:
        activeDocument ||
        "ALL USER DOCUMENTS",
    }
  );

  // =====================================
  // STEP 3:
  // Broad retrieval for one document
  // =====================================

  if (
    queryType === "broad" &&
    activeDocument
  ) {
    const broadChunks =
      await retrieveBroadDocument(
        activeDocument,
        userId
      );

    console.log(
      `Broad retrieval: ${broadChunks.length} chunks from ${activeDocument}`
    );

    return broadChunks;
  }

  // =====================================
  // STEP 4:
  // Generate question embedding
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
  // STEP 5:
  // Build SECURE MongoDB query
  //
  // userId is ALWAYS included.
  // =====================================

  const query = {
    userId,
  };

  if (activeDocument) {
    query.documentName =
      activeDocument;
  }

  // If no activeDocument:
  //
  // { userId }
  //
  // This means:
  // search ALL documents belonging
  // to THIS user only.

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
  // STEP 6:
  // Semantic scoring
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
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      );

  if (
    scoredChunks.length === 0
  ) {
    return [];
  }

  // =====================================
  // STEP 7:
  // Candidate selection
  // =====================================

  const candidates =
    scoredChunks.slice(
      0,
      MAX_CANDIDATES
    );

  // =====================================
  // STEP 8:
  // Hybrid reranking
  // =====================================

  const reranked =
    rerankChunks(
      candidates,
      question
    );

  // =====================================
  // STEP 9:
  // Adaptive final chunk count
  // =====================================

  let finalLimit =
    DEFAULT_TOP_K;

  if (
    queryType ===
      "comparison" ||
    queryType === "list" ||
    queryType === "broad"
  ) {
    finalLimit =
      BROAD_TOP_K;
  }

  // =====================================
  // STEP 10:
  // Final selection
  // =====================================

  let finalChunks;

  if (activeDocument) {
    finalChunks =
      reranked.slice(
        0,
        finalLimit
      );
  } else {
    finalChunks =
      selectDiverseChunks(
        reranked,
        finalLimit
      );
  }

  // =====================================
  // DEBUG LOGGING
  // =====================================

  console.log(
    "Final retrieved chunks:",
    finalChunks.map(
      ({
        chunk,
        score,
        keywordScore,
        finalScore,
      }) => ({
        document:
          chunk.documentName,

        chunk:
          chunk.chunkIndex +
          1,

        semanticScore:
          Number(
            score.toFixed(4)
          ),

        keywordScore:
          Number(
            keywordScore.toFixed(
              4
            )
          ),

        finalScore:
          Number(
            finalScore.toFixed(
              4
            )
          ),
      })
    )
  );

  // =====================================
  // STEP 11:
  // Convert to RAG document objects
  // =====================================

  return finalChunks.map(
    ({
      chunk,
      score,
      finalScore,
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

        rerankScore:
          finalScore,

        retrievalType:
          activeDocument
            ? "single-document"
            : "all-documents",
      },
    })
  );
}

module.exports = {
  retrieveRelevantChunks,
};