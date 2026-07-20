const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL =
  process.env.GROQ_MODEL ||
  "llama-3.1-8b-instant";

/**
 * Generate a normal non-streaming answer.
 */
async function generateAnswer(prompt) {
  const completion =
    await groq.chat.completions.create({
      model: MODEL,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,
      max_completion_tokens: 512,
    });

  return (
    completion.choices?.[0]
      ?.message?.content || ""
  );
}

/**
 * Generate a streaming answer.
 */
async function streamAnswer(
  prompt,
  onChunk
) {
  const stream =
    await groq.chat.completions.create({
      model: MODEL,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0,
      max_completion_tokens: 512,

      stream: true,
    });

  let fullAnswer = "";

  for await (const chunk of stream) {
    const content =
      chunk.choices?.[0]?.delta
        ?.content || "";

    if (!content) {
      continue;
    }

    fullAnswer += content;

    onChunk(content);
  }

  return fullAnswer;
}

module.exports = {
  generateAnswer,
  streamAnswer,
};