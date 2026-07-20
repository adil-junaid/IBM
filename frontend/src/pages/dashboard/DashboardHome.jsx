import { useCallback, useEffect, useState } from "react";
import {
  FiFileText,
  FiMessageSquare,
  FiCpu,
} from "react-icons/fi";

import { getDocuments } from "../../services/documentService";

const DashboardHome = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] =
    useState(true);

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
      console.error(
        "Failed to fetch documents:",
        error
      );

      setDocuments([]);
    } finally {
      setIsLoadingDocuments(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const cards = [
    {
      title: "Documents",
      value: isLoadingDocuments
        ? "..."
        : documents.length,
      icon: <FiFileText size={24} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Chats",
      value: "0",
      icon: <FiMessageSquare size={24} />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "AI Model",
      value: "Llama 3",
      icon: <FiCpu size={24} />,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Welcome back 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Manage your research documents and chat
          with your AI assistant.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="
              rounded-2xl
              border border-slate-200
              bg-white p-6
              shadow-sm
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-md
            "
          >
            <div
              className={`inline-flex rounded-xl p-3 ${card.color}`}
            >
              {card.icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-slate-800">
              {card.title}
            </h3>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Documents */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-xl font-semibold text-slate-800">
            Recent Documents
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Your recently uploaded research documents.
          </p>
        </div>

        {isLoadingDocuments ? (
          <p className="mt-6 text-sm text-slate-500">
            Loading documents...
          </p>
        ) : documents.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <FiFileText
              size={28}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-medium text-slate-700">
              No documents uploaded yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Go to the Upload page to add your first
              research document.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {documents.slice(0, 5).map((document, index) => {
              const documentName =
                document.originalName ||
                document.name ||
                document.filename ||
                `Document ${index + 1}`;

              return (
                <div
                  key={
                    document._id ||
                    documentName ||
                    index
                  }
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <FiFileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {documentName}
                    </p>

                    <p className="text-xs text-slate-500">
                      Research document
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;