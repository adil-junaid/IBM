import {
  useState,
} from "react";

import {
  FiCpu,
  FiUser,
  FiFileText,
  FiEdit2,
  FiCheck,
  FiX,
} from "react-icons/fi";

const ResponsePanel = ({
  messages,
  isLoading,
  onEditMessage,
}) => {
  const [
    editingMessageId,
    setEditingMessageId,
  ] = useState(null);

  const [
    editedContent,
    setEditedContent,
  ] = useState("");

  const startEditing = (
    message
  ) => {
    if (isLoading) {
      return;
    }

    setEditingMessageId(
      message.id
    );

    setEditedContent(
      message.content
    );
  };

  const cancelEditing = () => {
    setEditingMessageId(
      null
    );

    setEditedContent("");
  };

  const saveEdit = async (
    messageId
  ) => {
    const content =
      editedContent.trim();

    if (!content) {
      return;
    }

    setEditingMessageId(
      null
    );

    await onEditMessage?.(
      messageId,
      content
    );

    setEditedContent("");
  };

  if (
    messages.length === 0 &&
    !isLoading
  ) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <FiCpu size={26} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-800">
          Ask your research assistant
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Ask questions about your uploaded
          research documents and receive
          context-aware AI responses.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto p-6">
      {messages.map(
        (message) => {
          const isUser =
            message.role ===
            "user";

          const isEditing =
            editingMessageId ===
            message.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <FiCpu
                    size={18}
                  />
                </div>
              )}

              <div
                className={`group relative max-w-[80%] overflow-visible rounded-2xl px-4 py-3 ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {isEditing ? (
                  <div className="min-w-[300px]">
                    <textarea
                      value={
                        editedContent
                      }
                      onChange={(
                        event
                      ) =>
                        setEditedContent(
                          event.target
                            .value
                        )
                      }
                      autoFocus
                      rows={3}
                      className="w-full resize-none rounded-lg border border-blue-300 bg-white p-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-200"
                    />

                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={
                          cancelEditing
                        }
                        className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                      >
                        <FiX />

                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          saveEdit(
                            message.id
                          )
                        }
                        disabled={
                          !editedContent.trim()
                        }
                        className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        <FiCheck />

                        Save & Regenerate
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-sm leading-6">
                      {
                        message.content
                      }
                    </p>

                    {isUser &&
  !isLoading && (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        startEditing(message);
      }}
      className="absolute -left-10 top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg bg-white p-2 text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-blue-50 hover:text-blue-600"
      aria-label="Edit message"
      title="Edit message"
    >
      <FiEdit2 size={16} />
    </button>
  )}
                  </>
                )}

                {!isUser &&
                  message.sources
                    ?.length >
                    0 && (
                    <div className="mt-4 border-t border-slate-200 pt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Sources
                      </p>

                      <div className="space-y-2">
                        {[
                          ...new Set(
                            message.sources.map(
                              (
                                source
                              ) =>
                                source.name ||
                                source.document ||
                                source.source
                            )
                          ),
                        ]
                          .filter(
                            Boolean
                          )
                          .map(
                            (
                              source,
                              index
                            ) => (
                              <div
                                key={`${source}-${index}`}
                                className="flex items-center gap-2 text-xs text-slate-500"
                              >
                                <FiFileText />

                                <span>
                                  {
                                    source
                                  }
                                </span>
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  )}
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                  <FiUser
                    size={18}
                  />
                </div>
              )}
            </div>
          );
        }
      )}

      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiCpu
              size={18}
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />

              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />

              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsePanel;