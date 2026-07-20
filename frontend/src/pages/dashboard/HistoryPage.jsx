import {
  useEffect,
  useState,
} from "react";

import {
  FiMessageSquare,
  FiTrash2,
  FiFileText,
} from "react-icons/fi";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getConversations,
  deleteConversation,
} from "../../services/chatService";

const HistoryPage = () => {
  const navigate =
    useNavigate();

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  // ========================================
  // Load conversations
  // ========================================

  const fetchConversations =
    async () => {
      try {
        setIsLoading(true);

        const data =
          await getConversations();

        setConversations(
          data.conversations || []
        );
      } catch (error) {
        console.error(
          "History error:",
          error
        );

        toast.error(
          "Failed to load chat history."
        );
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchConversations();
  }, []);

  // ========================================
  // Open conversation
  // ========================================

  const handleOpen =
    (conversationId) => {
      localStorage.setItem(
        "activeConversationId",
        conversationId
      );

      navigate(
        "/dashboard/chat"
      );
    };

  // ========================================
  // Delete conversation
  // ========================================

  const handleDelete =
    async (
      event,
      conversationId
    ) => {
      event.stopPropagation();

      try {
        await deleteConversation(
          conversationId
        );

        // Remove from UI
        setConversations(
          (previous) =>
            previous.filter(
              (conversation) =>
                conversation._id !==
                conversationId
            )
        );

        // If deleted conversation
        // was active, remove it
        if (
          localStorage.getItem(
            "activeConversationId"
          ) === conversationId
        ) {
          localStorage.removeItem(
            "activeConversationId"
          );
        }

        toast.success(
          "Conversation deleted."
        );
      } catch (error) {
        console.error(
          "Delete conversation error:",
          error
        );

        toast.error(
          "Failed to delete conversation."
        );
      }
    };

  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800">
        Chat History
      </h2>

      <p className="mt-2 text-slate-500">
        Your previous AI research conversations.
      </p>

      {/* Loading */}

      {isLoading && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">
            Loading chat history...
          </p>
        </div>
      )}

      {/* Empty */}

      {!isLoading &&
        conversations.length ===
          0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FiMessageSquare
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 font-medium text-slate-700">
              No chat history yet.
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Start asking questions in
              your research workspace.
            </p>
          </div>
        )}

      {/* Conversations */}

      {!isLoading &&
        conversations.length >
          0 && (
          <div className="mt-8 space-y-3">
            {conversations.map(
              (
                conversation
              ) => (
                <div
                  key={
                    conversation._id
                  }
                  onClick={() =>
                    handleOpen(
                      conversation._id
                    )
                  }
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                      <FiMessageSquare
                        size={20}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-800">
                        {conversation.title ||
                          "New Conversation"}
                      </h3>

                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                        <FiFileText />

                        <span>
                          {conversation.document ||
                            "All Documents"}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {
                            conversation
                              .messages
                              ?.length ||
                              0
                          }{" "}
                          messages
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(
                      event
                    ) =>
                      handleDelete(
                        event,
                        conversation._id
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    aria-label="Delete conversation"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )
            )}
          </div>
        )}
    </div>
  );
};

export default HistoryPage;