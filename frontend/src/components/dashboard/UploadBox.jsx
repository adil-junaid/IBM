import { useRef, useState } from "react";
import { FiUploadCloud, FiFileText, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

import { uploadDocument } from "../../services/uploadService";

const UploadBox = ({ onUploadSuccess }) => {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const validateFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please select a PDF, DOCX, or TXT file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    validateFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    validateFile(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (event) => {
    event.stopPropagation();

    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;

    try {
      setIsUploading(true);

      const formData = new FormData();

      // "file" must match the field name expected by Multer
      formData.append("document", file);

      await uploadDocument(formData);

      toast.success("Document uploaded successfully.");

      setFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Upload error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to upload document.";

      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Upload Research Document
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add research papers and documents to your AI knowledge base.
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          flex cursor-pointer flex-col items-center justify-center
          rounded-2xl border-2 border-dashed px-6 py-12
          transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }
        `}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <FiUploadCloud size={26} />
        </div>

        <h3 className="mt-4 font-semibold text-slate-800">
          Drag & drop your document here
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          or click to browse from your computer
        </p>

        <p className="mt-4 text-xs text-slate-400">
          Supports PDF, DOCX and TXT
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {file && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <FiFileText size={20} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {file.name}
              </p>

              <p className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            disabled={isUploading}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Remove selected file"
          >
            <FiX size={20} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="
          mt-5 w-full rounded-xl bg-blue-600 px-5 py-3
          font-medium text-white transition
          hover:bg-blue-700
          disabled:cursor-not-allowed disabled:bg-slate-300
        "
      >
        {isUploading ? "Uploading..." : "Upload Document"}
      </button>
    </section>
  );
};

export default UploadBox;