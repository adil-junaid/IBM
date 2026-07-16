require("dotenv").config();

const { generateEmbedding } = require("./ai/embeddings");

async function testEmbedding() {
  try {
    const vector = await generateEmbedding(
      "Artificial Intelligence is transforming healthcare."
    );

    console.log("✅ Embedding Generated Successfully");
    console.log("Vector Length:", vector.length);
    console.log("First 10 Values:", vector.slice(0, 10));
  } catch (error) {
    console.error(error.message);
  }
}

testEmbedding();