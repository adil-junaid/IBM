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

// Number of chunks considered before
// final reranking.
const MAX_CANDIDATES = 20;

// Final chunks sent to the LLM.
const DEFAULT_TOP_K = 7;

// More context for broad questions.
const BROAD_TOP_K = 12;

// Maximum chunks for one document
// when a broad summary is requested.
const MAX_DOCUMENT_SUMMARY_CHUNKS = 20;


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
// ========================================

async function detectDocumentFromQuestion(
  question
) {
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
    normalizeText(question);

  // --------------------------------------
  // Exact filename detection
  //
  // Example:
  // "summarize FusionX.pdf"
  // --------------------------------------

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

  // --------------------------------------
  // Filename without extension
  //
  // Example:
  // "tell me about FusionX"
  // --------------------------------------

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

  // --------------------------------------
  // Broad document questions
  // --------------------------------------

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

  // --------------------------------------
  // Comparison questions
  // --------------------------------------

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

  // --------------------------------------
  // List questions
  // --------------------------------------

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

  // Default:
  // normal semantic question
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

    // Slight boost when a keyword
    // appears in the filename.
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
          candidate.chunk.documentName
        );

      // Hybrid ranking:
      //
      // 80% semantic similarity
      // 20% keyword relevance
      //
      // Semantic search handles questions
      // phrased differently from documents.
      //
      // Keyword matching helps names such
      // as QueuePilot, FusionX, React, etc.
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

  // --------------------------------------
  // First pass:
  // Ensure multiple relevant documents
  // can contribute to All Documents mode.
  // --------------------------------------

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

  // --------------------------------------
  // Second pass:
  // Fill remaining slots by relevance.
  // --------------------------------------

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
// ========================================

async function retrieveBroadDocument(
  documentName
) {
  const chunks =
    await DocumentChunk.find({
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

  // For reasonably sized documents,
  // provide all chunks so the LLM can
  // create a proper overview.
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

  // For large documents, sample chunks
  // across the entire document rather
  // than only taking the beginning.
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
// ========================================

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
  // STEP 1:
  // Detect query intent
  // =====================================

  const queryType =
    detectQueryType(
      question
    );

  // =====================================
  // STEP 2:
  // Determine active document
  //
  // Priority:
  //
  // 1. Document explicitly selected
  //    by user in UI.
  //
  // 2. Document explicitly mentioned
  //    in the question.
  //
  // 3. Otherwise search all documents.
  // =====================================

  const mentionedDocument =
    await detectDocumentFromQuestion(
      question
    );

  const activeDocument =
    documentName ||
    mentionedDocument ||
    null;

  console.log(
    "RAG retrieval request:",
    {
      question,
      queryType,
      selectedDocument:
        documentName,
      mentionedDocument,
      activeDocument:
        activeDocument ||
        "ALL DOCUMENTS",
    }
  );

  // =====================================
  // STEP 3:
  // Handle broad questions about
  // a specific document.
  //
  // Example:
  //
  // "Summarize FusionX.pdf"
  // "What are the contents of FusionX?"
  // =====================================

  if (
    queryType === "broad" &&
    activeDocument
  ) {
    const broadChunks =
      await retrieveBroadDocument(
        activeDocument
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
  // Build MongoDB search scope
  // =====================================

  const query = {};

  if (activeDocument) {
    query.documentName =
      activeDocument;
  }

  // No activeDocument means:
  //
  // {}
  //
  // Therefore MongoDB loads chunks
  // from ALL uploaded documents.

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
  //
  // Semantic similarity
  // +
  // keyword relevance
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
    queryType === "comparison" ||
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
    // One document:
    // pure relevance ranking.
    finalChunks =
      reranked.slice(
        0,
        finalLimit
      );
  } else {
    // All Documents:
    // maintain document diversity.
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
  // Convert MongoDB chunks into
  // document objects expected by
  // rag.service.js and prompt.js
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