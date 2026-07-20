import { useState } from "react";
import {
  FiSend,
  FiMessageSquare,
  FiTrash2,
  FiFileText,
  FiLayers,
} from "react-icons/fi";

import useChat from "../../hooks/useChat";
import ResponsePanel from "./ResponsePanel";

const ChatBox = ({ selectedDocument = null }) => {
  const [question, setQuestion] = useState("");

  const {
  messages,
  isLoading,
  sendChatMessage,
  clearChat,
  editMessage,
} = useChat();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    setQuestion("");

    await sendChatMessage(
      trimmedQuestion,
      selectedDocument
    );
  };

  return (
    <section className="flex min-h-[650px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiMessageSquare size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              AI Research Assistant
            </h2>

            <p className="text-xs text-slate-500">
              Ask questions about your research
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={clearChat}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
          >
            <FiTrash2 />
            Clear
          </button>
        )}
      </div>

      {/* Active Document */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="flex items-center gap-2 text-sm">
          {selectedDocument ? (
            <>
              <FiFileText className="text-blue-600" />

              <span className="text-slate-500">
                Chatting with:
              </span>

              <span className="max-w-md truncate font-medium text-slate-800">
                {selectedDocument}
              </span>
            </>
          ) : (
            <>
              <FiLayers className="text-blue-600" />

              <span className="text-slate-500">
                Searching:
              </span>

              <span className="font-medium text-slate-800">
                All Documents
              </span>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <ResponsePanel
  messages={messages}
  isLoading={isLoading}
  onEditMessage={editMessage}
/>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-slate-200 p-4"
      >
        <div className="flex items-end gap-3 rounded-xl border border-slate-300 bg-white p-2 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder={
              selectedDocument
                ? `Ask about ${selectedDocument}...`
                : "Ask across all your research documents..."
            }
            rows={1}
            disabled={isLoading}
            className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={
              !question.trim() || isLoading
            }
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label="Send message"
          >
            <FiSend size={18} />
          </button>
        </div>

        <p className="mt-2 text-center text-xs text-slate-400">
          {selectedDocument
            ? "AI responses will focus on the selected document."
            : "AI responses may use context from all uploaded documents."}
        </p>
      </form>
    </section>
  );
};

export default ChatBox;