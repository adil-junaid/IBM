import { useCallback, useEffect, useState } from "react";
import {
  FiFileText,
  FiLayers,
  FiRefreshCw,
} from "react-icons/fi";

import ChatBox from "../../components/dashboard/ChatBox";
import { getDocuments } from "../../services/documentService";

const ChatPage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoadingDocuments(true);

      const data = await getDocuments();

      if (Array.isArray(data)) {
        setDocuments(data);
      } else if (Array.isArray(data?.documents)) {
        setDocuments(data.documents);
      } else if (Array.isArray(data?.data)) {
        setDocuments(data.data);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      setDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const getDocumentName = (document) => {
    return (
      document.originalName ||
      document.name ||
      document.filename ||
      "Untitled Document"
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Research Workspace
        </h2>

        <p className="mt-2 text-slate-500">
          Select your research documents and ask AI-powered questions.
        </p>
      </div>

      {/* Workspace */}
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        {/* Documents Panel */}
        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h3 className="font-semibold text-slate-900">
                Your Documents
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {documents.length}{" "}
                {documents.length === 1 ? "document" : "documents"}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDocuments}
              disabled={isLoadingDocuments}
              className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 disabled:opacity-50"
              aria-label="Refresh documents"
            >
              <FiRefreshCw
                size={18}
                className={
                  isLoadingDocuments ? "animate-spin" : ""
                }
              />
            </button>
          </div>

          {/* Document Selection */}
          <div className="space-y-2 p-4">
            {/* All Documents */}
            <button
              type="button"
              onClick={() => setSelectedDocument(null)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                selectedDocument === null
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  selectedDocument === null
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <FiLayers size={19} />
              </div>

              <div className="min-w-0">
                <p className="font-medium">
                  All Documents
                </p>

                <p className="mt-0.5 text-xs opacity-70">
                  Search across your knowledge base
                </p>
              </div>
            </button>

            {/* Loading */}
            {isLoadingDocuments && (
              <div className="py-8 text-center text-sm text-slate-500">
                Loading documents...
              </div>
            )}

            {/* Empty State */}
            {!isLoadingDocuments && documents.length === 0 && (
              <div className="py-10 text-center">
                <FiFileText
                  size={26}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  No documents uploaded
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Upload a document before starting your research.
                </p>
              </div>
            )}

            {/* Documents */}
            {!isLoadingDocuments &&
              documents.map((document, index) => {
                const documentName = getDocumentName(document);

                const isSelected =
                  selectedDocument === documentName;

                return (
                  <button
                    type="button"
                    key={
                      document._id ||
                      documentName ||
                      index
                    }
                    onClick={() =>
                      setSelectedDocument(documentName)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? "bg-blue-100 text-blue-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <FiFileText size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {documentName}
                      </p>

                      <p className="mt-0.5 text-xs opacity-70">
                        Research document
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </aside>

        {/* Chat Panel */}
        <div className="min-w-0">
          <ChatBox
            selectedDocument={selectedDocument}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;