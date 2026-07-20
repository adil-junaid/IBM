const {
  askQuestion,
  streamQuestion,
} = require("../ai/rag.service");

const Chat = require(
  "../models/Chat"
);

const Conversation = require(
  "../models/conversation.model"
);

// ========================================
// NORMAL NON-STREAMING CHAT
// ========================================

const chatWithDocument = async (
  req,
  res
) => {
  try {
    // =====================================
    // AUTHENTICATED USER
    // =====================================

    const userId =
      req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({
          success: false,

          message:
            "Authentication required.",
        });
    }

    const {
      question,
      document = null,
      conversationId = null,
    } = req.body;

    if (
      !question ||
      !question.trim()
    ) {
      return res
        .status(400)
        .json({
          success: false,

          message:
            "Question is required.",
        });
    }

    const trimmedQuestion =
      question.trim();

    // =====================================
    // FIND EXISTING CONVERSATION
    //
    // SECURITY:
    // The conversation must belong to
    // the authenticated Clerk user.
    // =====================================

    let conversation =
      null;

    if (conversationId) {
      conversation =
        await Conversation.findOne({
          _id:
            conversationId,

          userId,
        });

      // If an ID was supplied but it does
      // not belong to this user, do not
      // silently access another user's data.
      if (!conversation) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              "Conversation not found.",
          });
      }
    }

    // =====================================
    // CREATE NEW CONVERSATION
    // =====================================

    if (!conversation) {
      conversation =
        await Conversation.create({
          userId,

          title:
            trimmedQuestion.length >
            50
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
    // SAVE USER MESSAGE
    // =====================================

    conversation.messages.push({
      role: "user",

      content:
        trimmedQuestion,
    });

    // null means:
    // search all documents owned
    // by this authenticated user.
    conversation.document =
      document || null;

    await conversation.save();

    // =====================================
    // GENERATE AI ANSWER
    //
    // userId flows into:
    //
    // RAG service
    //   ↓
    // retriever
    //   ↓
    // DocumentChunk.find({ userId })
    // =====================================

    const result =
      await askQuestion(
        trimmedQuestion,
        document,
        userId
      );

    // =====================================
    // SAVE ASSISTANT MESSAGE
    // =====================================

    conversation.messages.push({
      role: "assistant",

      content:
        result.answer,

      sources:
        result.sources ||
        [],
    });

    await conversation.save();

    // =====================================
    // SAVE USER-OWNED CHAT HISTORY
    // =====================================

    const chat =
      await Chat.create({
        userId,

        question:
          trimmedQuestion,

        answer:
          result.answer,

        document,

        sources:
          result.sources ||
          [],
      });

    return res.json({
      success: true,

      answer:
        result.answer,

      sources:
        result.sources ||
        [],

      chatId:
        chat._id,

      conversationId:
        conversation._id,
    });
  } catch (error) {
    console.error(
      "Chat controller error:",
      error
    );

    return res
      .status(500)
      .json({
        success: false,

        message:
          error.message ||
          "Failed to process chat request.",
      });
  }
};

// ========================================
// STREAMING CHAT
// ========================================

const streamChatWithDocument =
  async (
    req,
    res
  ) => {
    try {
      // ===================================
      // AUTHENTICATED USER
      // ===================================

      const userId =
        req.userId;

      if (!userId) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Authentication required.",
          });
      }

      const {
        question,
        document = null,
        conversationId = null,
      } = req.body;

      if (
        !question ||
        !question.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Question is required.",
          });
      }

      const trimmedQuestion =
        question.trim();

      // ===================================
      // FIND EXISTING CONVERSATION
      //
      // SECURITY:
      // Search by BOTH conversation ID
      // and authenticated user ID.
      // ===================================

      let conversation =
        null;

      if (conversationId) {
        conversation =
          await Conversation.findOne({
            _id:
              conversationId,

            userId,
          });

        if (!conversation) {
          return res
            .status(404)
            .json({
              success: false,

              message:
                "Conversation not found.",
            });
        }
      }

      // ===================================
      // CREATE NEW CONVERSATION
      // ===================================

      if (!conversation) {
        conversation =
          await Conversation.create({
            userId,

            title:
              trimmedQuestion
                .length > 50
                ? `${trimmedQuestion.slice(
                    0,
                    50
                  )}...`
                : trimmedQuestion,

            document,

            messages: [],
          });
      }

      // ===================================
      // SAVE USER MESSAGE
      // ===================================

      conversation.messages.push({
        role: "user",

        content:
          trimmedQuestion,
      });

      // null = all documents belonging
      // to the authenticated user.
      conversation.document =
        document || null;

      await conversation.save();

      // ===================================
      // STREAMING HEADERS
      // ===================================

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

      // ===================================
      // SEND CONVERSATION ID
      // ===================================

      res.write(
        JSON.stringify({
          type:
            "conversation",

          conversationId:
            conversation._id,
        }) + "\n"
      );

      // ===================================
      // STREAM AI ANSWER
      //
      // IMPORTANT:
      // Signature is now:
      //
      // streamQuestion(
      //   question,
      //   document,
      //   userId,
      //   onChunk
      // )
      // ===================================

      let fullAnswer = "";

      const result =
        await streamQuestion(
          trimmedQuestion,

          document,

          userId,

          (chunk) => {
            fullAnswer +=
              chunk;

            res.write(
              JSON.stringify({
                type:
                  "token",

                content:
                  chunk,
              }) + "\n"
            );
          }
        );

      // ===================================
      // SAVE ASSISTANT MESSAGE
      // ===================================

      conversation.messages.push({
        role:
          "assistant",

        content:
          fullAnswer ||
          "No response generated.",

        sources:
          result.sources ||
          [],
      });

      await conversation.save();

      // ===================================
      // SAVE USER-OWNED CHAT HISTORY
      // ===================================

      const chat =
        await Chat.create({
          userId,

          question:
            trimmedQuestion,

          answer:
            fullAnswer,

          document,

          sources:
            result.sources ||
            [],
        });

      // ===================================
      // SEND SOURCES
      // ===================================

      res.write(
        JSON.stringify({
          type:
            "sources",

          sources:
            result.sources ||
            [],
        }) + "\n"
      );

      // ===================================
      // SIGNAL COMPLETION
      // ===================================

      res.write(
        JSON.stringify({
          type:
            "done",

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

      if (
        !res.headersSent
      ) {
        return res
          .status(500)
          .json({
            success: false,

            message:
              error.message ||
              "Failed to process chat request.",
          });
      }

      res.write(
        JSON.stringify({
          type:
            "error",

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