import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  streamMessage,
  getConversation,
  clearConversation,
  editConversationMessage,
} from "../services/chatService";

const useChat = () => {
  // ========================================
  // State
  // ========================================

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    conversationId,
    setConversationId,
  ] = useState(() =>
    localStorage.getItem(
      "activeConversationId"
    )
  );

  // ========================================
  // Helper:
  // Convert MongoDB messages into
  // frontend message format
  // ========================================

  const formatMessages = (
    conversationMessages = []
  ) => {
    return conversationMessages.map(
      (message) => ({
        id:
          message._id ||
          crypto.randomUUID(),

        role:
          message.role,

        content:
          message.content,

        sources:
          message.sources ||
          [],
      })
    );
  };

  // ========================================
  // Load a conversation from MongoDB
  // ========================================

  const loadConversation = async (
    id
  ) => {
    if (!id) {
      return;
    }

    try {
      const data =
        await getConversation(
          id
        );

      const conversation =
        data.conversation;

      if (
        conversation?.messages
      ) {
        setMessages(
          formatMessages(
            conversation.messages
          )
        );
      }

      return conversation;
    } catch (error) {
      console.error(
        "Failed to load conversation:",
        error
      );

      throw error;
    }
  };

  // ========================================
  // Restore active conversation
  // when Chat page opens
  // ========================================

  useEffect(() => {
    const restoreConversation =
      async () => {
        if (!conversationId) {
          return;
        }

        try {
          await loadConversation(
            conversationId
          );
        } catch (error) {
          console.error(
            "Failed to restore conversation:",
            error
          );

          // The conversation may have
          // been deleted from MongoDB
          localStorage.removeItem(
            "activeConversationId"
          );

          setConversationId(
            null
          );

          setMessages([]);
        }
      };

    restoreConversation();
  }, [conversationId]);

  // ========================================
  // Send new chat message
  // ========================================

  const sendChatMessage = async (
    question,
    document = null
  ) => {
    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      isLoading
    ) {
      return;
    }

    // Temporary frontend ID.
    // This will be replaced by the real
    // MongoDB _id after streaming finishes.
    const userId =
      crypto.randomUUID();

    const assistantId =
      crypto.randomUUID();

    const userMessage = {
      id: userId,

      role: "user",

      content:
        trimmedQuestion,

      sources: [],
    };

    const assistantMessage = {
      id: assistantId,

      role: "assistant",

      content: "",

      sources: [],
    };

    // Immediately show user question
    // and empty AI message
    setMessages(
      (previousMessages) => [
        ...previousMessages,

        userMessage,

        assistantMessage,
      ]
    );

    let activeConversationId =
      conversationId;

    try {
      setIsLoading(
        true
      );

      await streamMessage(
        trimmedQuestion,

        document,

        conversationId,

        // ==================================
        // Handle streamed AI token
        // ==================================

        (token) => {
          setMessages(
            (
              previousMessages
            ) =>
              previousMessages.map(
                (message) =>
                  message.id ===
                  assistantId
                    ? {
                        ...message,

                        content:
                          message.content +
                          token,
                      }
                    : message
              )
          );
        },

        // ==================================
        // Handle sources
        // ==================================

        (sources) => {
          setMessages(
            (
              previousMessages
            ) =>
              previousMessages.map(
                (message) =>
                  message.id ===
                  assistantId
                    ? {
                        ...message,

                        sources:
                          sources ||
                          [],
                      }
                    : message
              )
          );
        },

        // ==================================
        // Handle conversation ID
        // ==================================

        (
          newConversationId
        ) => {
          if (
            !newConversationId
          ) {
            return;
          }

          activeConversationId =
            newConversationId;

          setConversationId(
            newConversationId
          );

          localStorage.setItem(
            "activeConversationId",

            newConversationId
          );
        }
      );

      // ==================================
      // IMPORTANT FIX
      //
      // Streaming used temporary UUIDs.
      // Reload from MongoDB after the
      // stream finishes so messages get
      // their real MongoDB _id values.
      // ==================================

      const savedConversationId =
        activeConversationId ||
        localStorage.getItem(
          "activeConversationId"
        );

      if (
        savedConversationId
      ) {
        await loadConversation(
          savedConversationId
        );
      }
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      // Remove temporary assistant
      // response if request failed
      setMessages(
        (
          previousMessages
        ) =>
          previousMessages.filter(
            (message) =>
              message.id !==
              assistantId
          )
      );

      toast.error(
        error.message ||
          "Failed to get a response from the AI."
      );
    } finally {
      setIsLoading(
        false
      );
    }
  };

  // ========================================
  // Edit user message
  // and regenerate its answer
  // ========================================

  const editMessage = async (
    messageId,
    newContent
  ) => {
    const trimmedContent =
      newContent.trim();

    if (
      !conversationId ||
      !messageId ||
      !trimmedContent ||
      isLoading
    ) {
      return;
    }

    try {
      setIsLoading(
        true
      );

      const data =
        await editConversationMessage(
          conversationId,

          messageId,

          trimmedContent
        );

      const conversation =
        data.conversation;

      // Backend returns the updated
      // conversation with real MongoDB IDs
      if (
        conversation?.messages
      ) {
        setMessages(
          formatMessages(
            conversation.messages
          )
        );
      } else {
        // Fallback:
        // reload from MongoDB
        await loadConversation(
          conversationId
        );
      }

      toast.success(
        "Message updated successfully."
      );
    } catch (error) {
      console.error(
        "Edit message error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to edit message."
      );
    } finally {
      setIsLoading(
        false
      );
    }
  };

  // ========================================
  // Clear current conversation
  // ========================================

  const clearChat = async () => {
    try {
      if (
        conversationId
      ) {
        await clearConversation(
          conversationId
        );
      }

      setMessages(
        []
      );

      toast.success(
        "Conversation cleared."
      );
    } catch (error) {
      console.error(
        "Clear chat error:",
        error
      );

      toast.error(
        error.message ||
          "Failed to clear conversation."
      );
    }
  };

  // ========================================
  // Start completely new conversation
  // ========================================

  const startNewChat = () => {
    setMessages(
      []
    );

    setConversationId(
      null
    );

    localStorage.removeItem(
      "activeConversationId"
    );
  };

  // ========================================
  // Return hook values
  // ========================================

  return {
    messages,

    isLoading,

    conversationId,

    sendChatMessage,

    editMessage,

    clearChat,

    startNewChat,
  };
};

export default useChat;