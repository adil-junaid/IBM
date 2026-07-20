const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction";

async function generateEmbedding(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required to generate an embedding");
  }

  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: text,
      options: {
        wait_for_model: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Hugging Face embedding error (${response.status}): ${errorText}`
    );
  }

  const embedding = await response.json();

  // If Hugging Face returns nested token embeddings,
  // calculate the mean to create a single embedding vector.
  if (
    Array.isArray(embedding) &&
    embedding.length > 0 &&
    Array.isArray(embedding[0])
  ) {
    const dimensions = embedding[0].length;

    return Array.from({ length: dimensions }, (_, i) => {
      return (
        embedding.reduce((sum, tokenEmbedding) => {
          return sum + tokenEmbedding[i];
        }, 0) / embedding.length
      );
    });
  }

  // If Hugging Face already returns a single embedding vector.
  if (Array.isArray(embedding)) {
    return embedding;
  }

  throw new Error("Unexpected embedding response from Hugging Face");
}

module.exports = { generateEmbedding };