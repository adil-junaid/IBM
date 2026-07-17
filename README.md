# 🤖 AI Research Assistant

An AI-powered Research Assistant that enables users to upload research documents, perform semantic search, and interact with their documents using Retrieval-Augmented Generation (RAG).

The application combines a modern React frontend with a Node.js backend, MongoDB Atlas for document metadata, LangChain for retrieval, and Ollama for running local Large Language Models.

---

## ✨ Features

### Frontend
- 🎨 Modern dashboard with sidebar and top navigation
- 📄 Upload research documents
- 📚 View uploaded documents
- 💬 AI chat interface
- 📱 Responsive UI built with Tailwind CSS

### Backend
- 📄 PDF and DOCX document upload
- ✂️ Automatic document parsing and chunking
- 🧠 Embedding generation using Ollama
- 🔍 Semantic document retrieval using LangChain
- 💬 Context-aware AI responses (RAG)
- 🗂️ MongoDB Atlas metadata storage
- 🗑️ Document deletion
- 🌐 RESTful API

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS v4
- Axios
- React Icons

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- LangChain
- Ollama
- Multer
- pdf-parse
- Mammoth
- dotenv

---

# 📂 Project Structure

```text
AI-Research-Assistant/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── landing/
│   │   │   └── layout/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── uploads/
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/<your-username>/<repository-name>.git
```

```bash
cd AI-Research-Assistant
```

---

# ⚙️ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

OLLAMA_BASE_URL=http://localhost:11434

MODEL_NAME=llama3.2

EMBEDDING_MODEL=nomic-embed-text
```

Run the backend:

```bash
npm run dev
```

---

# 💻 Frontend Setup

```bash
cd frontend
npm install
```

Run the frontend:

```bash
npm run dev
```

The application will be available at:

```
Frontend : http://localhost:5173

Backend  : http://localhost:5001
```

---

# 🦙 Ollama Setup

Install Ollama:

https://ollama.com/

Pull the required models:

```bash
ollama pull llama3.2
```

```bash
ollama pull nomic-embed-text
```

Start Ollama:

```bash
ollama serve
```

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | Health Check |
| POST | `/api/upload` | Upload document |
| POST | `/api/chat` | Ask questions |
| GET | `/api/documents` | List uploaded documents |
| DELETE | `/api/documents/:id` | Delete document |

---

# 🔄 Application Workflow

```text
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
Store Metadata
      │
      ▼
Semantic Search
      │
      ▼
Retrieve Relevant Context
      │
      ▼
Generate AI Response
```

---

# 📌 Current Progress

## Frontend

- ✅ Landing Page
- ✅ Dashboard Layout
- ✅ Sidebar Navigation
- ✅ Top Navigation
- ✅ Dashboard Statistics Cards
- 🚧 Upload Workspace
- 🚧 AI Chat Interface
- 🚧 Document Management UI

## Backend

- ✅ PDF Upload
- ✅ DOCX Upload
- ✅ Text Extraction
- ✅ Chunking
- ✅ Embedding Generation
- ✅ LangChain Retrieval
- ✅ MongoDB Integration
- ✅ Document APIs

---

# 🛣️ Roadmap

- [ ] Drag-and-drop upload
- [ ] Live document statistics
- [ ] Chat history
- [ ] Conversation memory
- [ ] Persistent vector database
- [ ] Authentication
- [ ] Streaming AI responses
- [ ] Docker support
- [ ] Unit & Integration Testing
- [ ] Swagger Documentation

---

# 📸 Screenshots

## Landing Page

_Add screenshot here_

## Dashboard

_Add screenshot here_

## Chat Workspace

_Add screenshot here_

---

# 👨‍💻 Author

**Adil Junaid**

AI Research Assistant built using the MERN stack, LangChain, Ollama, and MongoDB Atlas.

---

# 📄 License

This project is licensed under the MIT License.
