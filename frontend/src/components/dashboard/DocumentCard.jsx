import {
  FiFileText,
  FiTrash2,
} from "react-icons/fi";

const DocumentCard = ({
  document,
  onDelete,
  isDeleting,
}) => {
  // Support different possible backend property names
  const documentName =
    document.originalName ||
    document.name ||
    document.filename ||
    "Untitled Document";

  return (
    <div
      className="
        group flex items-center justify-between
        rounded-xl border border-slate-200
        bg-white p-4
        transition-all duration-200
        hover:border-blue-200 hover:shadow-sm
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        {/* File Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <FiFileText size={21} />
        </div>

        {/* File Information */}
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-800">
            {documentName}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Research document
          </p>
        </div>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => onDelete(documentName)}
        disabled={isDeleting}
        className="
          ml-4 rounded-lg p-2
          text-slate-400
          transition
          hover:bg-red-50
          hover:text-red-500
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        aria-label={`Delete ${documentName}`}
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default DocumentCard;