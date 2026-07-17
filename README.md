# 📚 AI Research & Document Assistant (RAG)

An AI-powered Research & Document Assistant that allows users to upload documents (PDF, DOCX, TXT, Markdown) and interact with them using Retrieval-Augmented Generation (RAG).

The application extracts document content, generates vector embeddings, retrieves relevant information, and uses a Large Language Model (LLM) to answer user queries accurately.

---

## 🚀 Features

### 📄 Document Management
- Upload PDF, DOCX, TXT, and Markdown files
- Drag & Drop file upload
- Multiple document support (future)
- File preview

### 🤖 AI Chat
- Chat with uploaded documents
- Context-aware responses
- Streaming AI responses
- Markdown rendering
- Code block support

### 📝 AI Summary
- Complete document summary
- Chapter-wise summary
- Key points extraction
- Important definitions

### 🎓 Learning Tools
- AI-generated Flashcards
- Quiz Generator (MCQs)
- Short-answer questions

### 🔍 Search
- Semantic Search
- Similarity Search using Vector Database

### 📤 Export
- Download summaries
- Export notes (Future)

---

# 🏗 Project Structure

```
IBM_DOCANALYZER/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── docker/
│
├── README.md
│
└── .gitignore
```

---

# 💻 Frontend

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- React Markdown
- React Dropzone

---

## Frontend Folder Structure

```
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   │
│   ├── pages/
│   │     Landing.jsx
│   │     Dashboard.jsx
│   │     Chat.jsx
│   │     Upload.jsx
│   │     Summary.jsx
│   │     Flashcards.jsx
│   │     Quiz.jsx
│   │     Settings.jsx
│   │
│   ├── hooks/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

---

## Frontend Requirements

- Responsive Design
- Modern UI/UX
- Dark Theme
- Mobile Friendly
- ChatGPT-style Chat Interface
- Drag & Drop Upload
- Markdown Rendering
- Loading Indicators
- Error Handling
- Toast Notifications

---

# ⚙ Backend

## Tech Stack

- Node.js
- Express.js
- Multer
- pdf-parse
- LangChain
- OpenAI API
- ChromaDB
- dotenv
- Docker

---

## Backend Folder Structure

```
backend/
│
├── src/
│
├── config/
│
├── controllers/
│
├── middleware/
│
├── routes/
│
├── services/
│
├── utils/
│
├── uploads/
│
├── app.js
│
└── server.js
```

---

## Backend Requirements

### File Upload
- PDF Upload
- DOCX Upload
- TXT Upload
- Markdown Upload

### Processing
- Extract document text
- Clean extracted text
- Split into chunks
- Generate embeddings

### AI Services
- RAG Pipeline
- Prompt Engineering
- LLM Integration
- Streaming Responses

### Database
- ChromaDB
- Vector Search

### API
- REST APIs
- Error Handling
- Validation
- Secure API Keys

---

# 📡 API Endpoints

## Upload

```
POST /api/upload
```

Upload a document.

---

## Chat

```
POST /api/chat
```

Chat with uploaded documents.

---

## Summary

```
GET /api/summary
```

Generate AI summary.

---

## Flashcards

```
GET /api/flashcards
```

Generate flashcards.

---

## Quiz

```
GET /api/quiz
```

Generate quiz questions.

---

## Health Check

```
GET /api/health
```

Server health status.

---

# 🧠 RAG Workflow

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
Store in ChromaDB
        │
        ▼
User Query
        │
        ▼
Similarity Search
        │
        ▼
Relevant Context
        │
        ▼
OpenAI GPT
        │
        ▼
AI Response
```

---

# 🛠 Installation

## Clone Repository

```bash
git clone https://github.com/<username>/IBM_DOCANALYZER.git

cd IBM_DOCANALYZER
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Runs on:

```
http://localhost:5000
```

---

# 📦 Environment Variables

Backend `.env`

```
PORT=5000

OPENAI_API_KEY=your_openai_api_key

CHROMA_DB_URL=http://localhost:8000
```

---

# 🚀 Deployment

- Docker
- AWS App Runner
- AWS S3 (Future)
- GitHub Actions (Future)

---

# 📅 Development Roadmap

## Phase 1
- [ ] Project Setup
- [ ] Frontend Layout
- [ ] Backend Server

## Phase 2
- [ ] Document Upload
- [ ] PDF Parsing
- [ ] AI Chat

## Phase 3
- [ ] RAG Integration
- [ ] Semantic Search
- [ ] Streaming Responses

## Phase 4
- [ ] AI Summary
- [ ] Flashcards
- [ ] Quiz Generator

## Phase 5
- [ ] Authentication
- [ ] Multiple Documents
- [ ] Export Notes
- [ ] Cloud Deployment

---

# 👥 Team

- Backend Development
- Frontend Development
- AI Integration
- UI/UX Design
- Cloud Deployment

---

# 📄 License

This project is developed for educational and research purposes.
