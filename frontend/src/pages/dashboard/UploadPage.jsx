import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import UploadBox from "../../components/dashboard/UploadBox";
import DocumentList from "../../components/dashboard/DocumentList";

import {
  getDocuments,
  deleteDocument,
} from "../../services/documentService";

const UploadPage = () => {
  const [documents, setDocuments] = useState([]);

  const [
    isLoadingDocuments,
    setIsLoadingDocuments,
  ] = useState(true);

  const [
    deletingDocument,
    setDeletingDocument,
  ] = useState(null);

  // Fetch uploaded documents
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

      toast.error(
        "Failed to load uploaded documents."
      );
    } finally {
      setIsLoadingDocuments(false);
    }
  }, []);

  // Load documents when page opens
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Delete document
  const handleDeleteDocument = async (name) => {
    if (!name) {
      return;
    }

    try {
      setDeletingDocument(name);

      await deleteDocument(name);

      toast.success(
        "Document deleted successfully."
      );

      await fetchDocuments();
    } catch (error) {
      console.error(
        "Failed to delete document:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to delete document.";

      toast.error(message);
    } finally {
      setDeletingDocument(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">
          Documents
        </h2>

        <p className="mt-2 text-slate-500">
          Upload and manage documents available to
          your AI research assistant.
        </p>
      </div>

      {/* Upload */}
      <UploadBox
        onUploadSuccess={fetchDocuments}
      />

      {/* Uploaded Documents */}
      <DocumentList
        documents={documents}
        isLoading={isLoadingDocuments}
        onDelete={handleDeleteDocument}
        deletingDocument={deletingDocument}
      />
    </div>
  );
};

export default UploadPage;