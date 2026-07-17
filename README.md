# 🤖 AI Research Assistant - Backend

The backend of the AI Research Assistant is built with **Node.js**, **Express.js**, **MongoDB Atlas**, **LangChain**, and **Ollama**. It provides APIs for document upload, processing, semantic search, and AI-powered question answering using Retrieval-Augmented Generation (RAG).

---

# 🚀 Features

- 📄 Upload PDF and DOCX research documents
- ✂️ Automatic document parsing and text chunking
- 🧠 Generate embeddings using Ollama
- 🔍 Semantic document retrieval using LangChain
- 💬 AI-powered question answering with context-aware responses
- 📚 Support for multiple uploaded documents
- 🗂️ Store document metadata in MongoDB Atlas
- 🗑️ Delete uploaded documents
- 🌐 RESTful API architecture
- ⚙️ Environment-based configuration using dotenv

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Backend Runtime |
| Express.js | REST API Framework |
| MongoDB Atlas | Document Metadata Storage |
| Mongoose | MongoDB ODM |
| LangChain | RAG Pipeline |
| Ollama | Local LLM & Embeddings |
| Multer | File Upload Handling |
| pdf-parse | PDF Text Extraction |
| Mammoth | DOCX Text Extraction |
| dotenv | Environment Variable Management |

---

# 📁 Project Structure

```
backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── uploadController.js
│   │   ├── chatController.js
│   │   └── documentController.js
│   │
│   ├── models/
│   │   └── Document.js
│   │
│   ├── routes/
│   │   ├── uploadRoutes.js
│   │   ├── chatRoutes.js
│   │   └── documentRoutes.js
│   │
│   ├── services/
│   │   ├── embeddingService.js
│   │   ├── vectorStore.js
│   │   └── documentParser.js
│   │
│   ├── uploads/
│   │
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

> Update the structure if your folder names differ.

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/adil-junaid/IBM/tree/backend-dev
```

Navigate to backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

OLLAMA_BASE_URL=http://localhost:11434

MODEL_NAME=llama3.2

EMBEDDING_MODEL=nomic-embed-text
```

---

# 🗄️ MongoDB Setup

This project uses **MongoDB Atlas** to store document metadata.

Example connection string:

```text
mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name
```

---

# 🦙 Ollama Setup

Install Ollama from:

https://ollama.com/

Pull the required models:

```bash
ollama pull llama3.2
```

```bash
ollama pull nomic-embed-text
```

Verify Ollama is running:

```bash
ollama serve
```

---

# ▶️ Running the Backend

Development mode

```bash
npm run dev
```

Production mode

```bash
npm start
```

Expected output

```text
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5001
```

---

# 📡 API Endpoints

## Health Check

```
GET /
```

Response

```json
{
    "success": true,
    "message": "AI Research Assistant Backend is Running 🚀"
}
```

---

## Upload Document

```
POST /api/upload
```

Accepts

- PDF
- DOCX

Returns

- Upload status
- Document metadata

---

## Chat with Documents

```
POST /api/chat
```

Request

```json
{
    "question": "Explain the introduction section."
}
```

Response

```json
{
    "answer": "..."
}
```

---

## Get Uploaded Documents

```
GET /api/documents
```

Returns

- Uploaded document list
- Metadata

---

## Delete Document

```
DELETE /api/documents/:id
```

Deletes

- MongoDB metadata
- Associated vector data (if applicable)

---

# 🔄 Backend Workflow

```
Upload Document
       │
       ▼
Extract Text
       │
       ▼
Split into Chunks
       │
       ▼
Generate Embeddings
       │
       ▼
Store Metadata (MongoDB)
       │
       ▼
Store Embeddings (Memory Vector Store)
       │
       ▼
User Question
       │
       ▼
Semantic Retrieval
       │
       ▼
LLM (Ollama)
       │
       ▼
Answer
```

---

# 📌 Current Implementation

- ✅ PDF upload
- ✅ DOCX upload
- ✅ Text extraction
- ✅ Text chunking
- ✅ Embedding generation
- ✅ Semantic retrieval
- ✅ Retrieval-Augmented Generation (RAG)
- ✅ MongoDB Atlas integration
- ✅ Metadata storage
- ✅ Document deletion
- ✅ Multi-document support

---

# 🔮 Future Enhancements

- Persistent vector database (e.g., ChromaDB, Pinecone, Weaviate)
- User authentication and authorization
- Chat history storage
- Conversation memory
- Document versioning
- Streaming AI responses
- Docker support
- Unit and integration testing
- Swagger/OpenAPI documentation

---

# 👩‍💻 Author

Developed as part of an AI Research Assistant project using Node.js, Express.js, LangChain, Ollama, and MongoDB Atlas.