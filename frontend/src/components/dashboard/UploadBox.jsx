import { useState } from "react";
import toast from "react-hot-toast";
import { uploadDocument } from "../../services/uploadService";

function UploadBox({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await uploadDocument(formData);

      toast.success(
        response.message || "Document uploaded successfully!"
      );

      setSelectedFile(null);

      // Refresh document list after upload
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-box">
      <h2>Upload Research Document</h2>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <p>
          Selected File: <strong>{selectedFile.name}</strong>
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default UploadBox;