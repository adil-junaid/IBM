require("dotenv").config();

const {
  generateEmbedding,
} = require("./src/services/embedding.service.js");

async function testEmbedding() {
  try {
    console.log("Generating embedding...");

    const embedding = await generateEmbedding(
      "Artificial intelligence is transforming research."
    );

    console.log("Embedding generated successfully!");
    console.log("Vector dimensions:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
  } catch (error) {
    console.error("Embedding test failed:");
    console.error(error.message);
  }
}

testEmbedding();