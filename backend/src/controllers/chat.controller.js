const {
  askQuestion,
  streamQuestion,
} = require("../ai/rag.service");

const Chat = require("../models/Chat");
const Conversation = require(
  "../models/conversation.model"
);

/**
 * Normal non-streaming chat
 */
const chatWithDocument = async (req, res) => {
  try {
    const {
      question,
      document = null,
      conversationId = null,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const trimmedQuestion =
      question.trim();

    // =====================================
    // Find or create conversation
    // =====================================

    let conversation = null;

    if (conversationId) {
      conversation =
        await Conversation.findById(
          conversationId
        );
    }

    if (!conversation) {
      conversation =
        await Conversation.create({
          title:
            trimmedQuestion.length > 50
              ? `${trimmedQuestion.slice(
                  0,
                  50
                )}...`
              : trimmedQuestion,

          document,

          messages: [],
        });
    }

    // Save user message
    conversation.messages.push({
      role: "user",
      content: trimmedQuestion,
    });

    conversation.document =
      document || null;

    await conversation.save();

    // =====================================
    // Generate AI answer
    // =====================================

    const result = await askQuestion(
      trimmedQuestion,
      document
    );

    // =====================================
    // Save assistant message
    // =====================================

    conversation.messages.push({
      role: "assistant",
      content: result.answer,
      sources: result.sources || [],
    });

    await conversation.save();

    // =====================================
    // Keep existing Chat history
    // =====================================

    const chat = await Chat.create({
      question: trimmedQuestion,
      answer: result.answer,
      document,
      sources: result.sources || [],
    });

    return res.json({
      success: true,

      answer: result.answer,

      sources:
        result.sources || [],

      chatId: chat._id,

      conversationId:
        conversation._id,
    });
  } catch (error) {
    console.error(
      "Chat controller error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to process chat request.",
    });
  }
};

/**
 * Streaming chat
 */
const streamChatWithDocument = async (
  req,
  res
) => {
  try {
    const {
      question,
      document = null,
      conversationId = null,
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    const trimmedQuestion =
      question.trim();

    // =====================================
    // Find existing conversation
    // or create a new conversation
    // =====================================

    let conversation = null;

    if (conversationId) {
      conversation =
        await Conversation.findById(
          conversationId
        );
    }

    if (!conversation) {
      conversation =
        await Conversation.create({
          title:
            trimmedQuestion.length > 50
              ? `${trimmedQuestion.slice(
                  0,
                  50
                )}...`
              : trimmedQuestion,

          document,

          messages: [],
        });
    }

    // =====================================
    // Save USER message
    // =====================================

    conversation.messages.push({
      role: "user",
      content: trimmedQuestion,
    });

    // Update active document mode
    // null = All Documents
    conversation.document =
      document || null;

    await conversation.save();

    // =====================================
    // Streaming headers
    // =====================================

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.flushHeaders();

    // IMPORTANT:
    // Send conversation ID immediately.
    // Frontend needs this for future messages.
    res.write(
      JSON.stringify({
        type: "conversation",
        conversationId:
          conversation._id,
      }) + "\n"
    );

    // =====================================
    // Stream AI answer
    // =====================================

    let fullAnswer = "";

    const result =
      await streamQuestion(
        trimmedQuestion,
        document,

        (chunk) => {
          fullAnswer += chunk;

          res.write(
            JSON.stringify({
              type: "token",
              content: chunk,
            }) + "\n"
          );
        }
      );

    // =====================================
    // Save ASSISTANT message
    // =====================================

    conversation.messages.push({
      role: "assistant",

      content:
        fullAnswer ||
        "No response generated.",

      sources:
        result.sources || [],
    });

    await conversation.save();

    // =====================================
    // Keep old Chat history
    // =====================================

    const chat = await Chat.create({
      question: trimmedQuestion,

      answer: fullAnswer,

      document,

      sources:
        result.sources || [],
    });

    // =====================================
    // Send sources
    // =====================================

    res.write(
      JSON.stringify({
        type: "sources",

        sources:
          result.sources || [],
      }) + "\n"
    );

    // =====================================
    // Signal completion
    // =====================================

    res.write(
      JSON.stringify({
        type: "done",

        chatId:
          chat._id,

        conversationId:
          conversation._id,
      }) + "\n"
    );

    res.end();
  } catch (error) {
    console.error(
      "Streaming chat error:",
      error
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to process chat request.",
      });
    }

    res.write(
      JSON.stringify({
        type: "error",

        message:
          error.message ||
          "Failed to process chat request.",
      }) + "\n"
    );

    res.end();
  }
};

module.exports = {
  chatWithDocument,
  streamChatWithDocument,
};