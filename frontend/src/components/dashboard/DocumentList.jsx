import { FiFileText } from "react-icons/fi";

import DocumentCard from "./DocumentCard";

const DocumentList = ({
  documents,
  onDelete,
  isLoading,
  deletingDocument,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Uploaded Documents
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Documents available to your AI research assistant.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
          {documents.length}{" "}
          {documents.length === 1 ? "Document" : "Documents"}
        </span>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="py-10 text-center text-sm text-slate-500">
          Loading documents...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && documents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
            <FiFileText size={22} />
          </div>

          <h3 className="mt-4 font-semibold text-slate-800">
            No documents yet
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Upload your first research document to start asking
            AI-powered questions.
          </p>
        </div>
      )}

      {/* Documents */}
      {!isLoading && documents.length > 0 && (
        <div className="space-y-3">
          {documents.map((document, index) => {
            const key =
              document._id ||
              document.name ||
              document.filename ||
              index;

            const documentName =
              document.originalName ||
              document.name ||
              document.filename;

            return (
              <DocumentCard
                key={key}
                document={document}
                onDelete={onDelete}
                isDeleting={
                  deletingDocument === documentName
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default DocumentList;