const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

/**
 * Stream an AI response.
 */
export const streamMessage = async (
  question,
  document,
  conversationId,
  onToken,
  onSources,
  onConversation
) => {
  const response = await fetch(
    `${API_URL}/api/chat/stream`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        question,
        document,
        conversationId,
      }),
    }
  );

  if (!response.ok) {
    const errorData =
      await response
        .json()
        .catch(() => ({}));

    throw new Error(
      errorData.message ||
        "Failed to get AI response."
    );
  }

  if (!response.body) {
    throw new Error(
      "Streaming is not supported."
    );
  }

  const reader =
    response.body.getReader();

  const decoder =
    new TextDecoder();

  let buffer = "";

  while (true) {
    const {
      done,
      value,
    } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(
      value,
      {
        stream: true,
      }
    );

    const lines =
      buffer.split("\n");

    // Keep incomplete JSON line
    buffer =
      lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) {
        continue;
      }

      let data;

      try {
        data =
          JSON.parse(line);
      } catch (error) {
        console.error(
          "Stream parsing error:",
          error
        );

        continue;
      }

      if (
        data.type ===
        "conversation"
      ) {
        onConversation?.(
          data.conversationId
        );
      }

      if (
        data.type === "token"
      ) {
        onToken?.(
          data.content
        );
      }

      if (
        data.type === "sources"
      ) {
        onSources?.(
          data.sources || []
        );
      }

      if (
        data.type === "done"
      ) {
        onConversation?.(
          data.conversationId
        );
      }

      if (
        data.type === "error"
      ) {
        throw new Error(
          data.message ||
            "Streaming failed."
        );
      }
    }
  }
};

/**
 * Get all conversations.
 */
export const getConversations =
  async () => {
    const response = await fetch(
      `${API_URL}/api/conversations`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch conversations."
      );
    }

    return response.json();
  };

/**
 * Get one conversation.
 */
export const getConversation =
  async (conversationId) => {
    const response = await fetch(
      `${API_URL}/api/conversations/${conversationId}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch conversation."
      );
    }

    return response.json();
  };

/**
 * Delete conversation.
 */
export const deleteConversation =
  async (conversationId) => {
    const response = await fetch(
      `${API_URL}/api/conversations/${conversationId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to delete conversation."
      );
    }

    return response.json();
  };

/**
 * Clear messages in a conversation.
 */
export const clearConversation =
  async (conversationId) => {
    const response = await fetch(
      `${API_URL}/api/conversations/${conversationId}/messages`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to clear conversation."
      );
    }

    return response.json();
  };

/**
 * Edit a user message and regenerate
 * the AI response.
 */
export const editConversationMessage =
  async (
    conversationId,
    messageId,
    content
  ) => {
    const response = await fetch(
      `${API_URL}/api/conversations/${conversationId}/messages/${messageId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          content,
        }),
      }
    );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to edit message."
      );
    }

    return data;
  };