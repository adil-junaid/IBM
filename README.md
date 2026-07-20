# 📚 AI Research & Document Assistant

An AI-powered Research and Document Assistant built using Retrieval-Augmented Generation (RAG).

The application allows users to upload research documents and interact with their content through an AI-powered chat interface. Documents are parsed, split into chunks, converted into vector embeddings, and stored persistently in MongoDB. When a user asks a question, the application retrieves relevant document chunks and provides them as context to a hosted Large Language Model (LLM).

The project supports multi-document research, document-specific querying, persistent conversations, source references, and real-time streaming AI responses.

---

## 🚀 Features

### 📄 Document Management

- Upload research documents
- PDF document support
- DOCX document support
- TXT document support
- Markdown document support
- Drag-and-drop file upload
- Multiple document support
- Persistent document metadata
- Document-specific querying
- Search across all uploaded documents

### 🤖 AI Research Assistant

- Chat with uploaded research documents
- Retrieval-Augmented Generation (RAG)
- Context-aware AI responses
- Multi-document retrieval
- Single-document retrieval
- Source references
- Markdown response rendering
- Persistent conversation history

### ⚡ Real-Time Streaming

AI responses are streamed progressively from the backend to the frontend, allowing users to see the response as it is generated instead of waiting for the complete response.

### 🔍 Semantic Retrieval

The application uses vector embeddings to find document chunks that are semantically related to the user's question.

The current retrieval pipeline uses:

- Hugging Face hosted embeddings
- `sentence-transformers/all-MiniLM-L6-v2`
- 384-dimensional embedding vectors
- Persistent vector storage in MongoDB
- Cosine similarity retrieval

Native MongoDB Atlas Vector Search can be integrated as a future optimization for larger-scale deployments.

### 💬 Conversation Management

- Create conversations
- Store user and assistant messages
- Maintain conversation history
- Associate conversations with selected documents
- Continue previous research conversations

---

# 🏗 Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │   Vite + Tailwind   │
                         └──────────┬──────────┘
                                    │
                                    │ HTTP / Streaming
                                    ▼
                         ┌─────────────────────┐
                         │   Express Backend   │
                         │      Node.js        │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             Document Parser   Hugging Face       Groq API
                    │           Embeddings          LLM
                    │               │               │
                    ▼               ▼               │
                 Chunks       384D Vectors          │
                    │               │               │
                    └───────┬───────┘               │
                            ▼                       │
                     MongoDB Atlas                  │
                            │                       │
                            ▼                       │
                    Cosine Similarity               │
                            │                       │
                            ▼                       │
                    Relevant Context ───────────────┘
                            │
                            ▼
                    Streaming AI Answer
```

---

# 🧠 RAG Workflow

```text
Upload Document
       │
       ▼
Extract Document Text
       │
       ▼
Split Text into Chunks
       │
       ▼
Generate Hugging Face Embeddings
       │
       ▼
384-Dimensional Vectors
       │
       ▼
Store Chunks + Vectors in MongoDB
       │
       ▼
User Asks a Question
       │
       ▼
Generate Question Embedding
       │
       ▼
Cosine Similarity Search
       │
       ▼
Retrieve Most Relevant Chunks
       │
       ▼
Build RAG Prompt
       │
       ▼
Groq Hosted LLM
       │
       ▼
Stream AI Response to Frontend
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
- React Icons
- React Markdown
- React Dropzone
- React Hot Toast

The frontend provides a responsive research dashboard with document management, AI chat, conversation history, source references, and real-time streamed responses.

---

# ⚙️ Backend

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- pdf-parse
- Mammoth
- Groq SDK
- Hugging Face Inference API
- LangChain
- dotenv

The backend is responsible for:

- API routing
- Document uploads
- Document parsing
- Text chunking
- Embedding generation
- Persistent vector storage
- Semantic retrieval
- RAG prompt generation
- LLM communication
- Streaming responses
- Conversation persistence
- Chat history

All sensitive API credentials are stored as server-side environment variables.

---

# 🤖 AI Integration

## Large Language Model

The application uses a hosted LLM through the Groq API.

The current model is configured through:

```env
GROQ_MODEL=llama-3.1-8b-instant
```

The model configuration can be changed using environment variables without exposing credentials to the frontend.

## Embedding Model

Document and query embeddings are generated using:

```text
sentence-transformers/all-MiniLM-L6-v2
```

Embedding dimension:

```text
384
```

Embeddings are generated through a hosted Hugging Face inference endpoint, removing the need for a locally running embedding model.

---

# 🗄️ Database

MongoDB is used for persistent application storage.

The application stores:

- Document metadata
- Document chunks
- Vector embeddings
- Conversations
- Conversation messages
- Chat history

Unlike an in-memory vector store, uploaded document embeddings remain available after the backend or Docker containers restart.

---

# 📡 Main API Routes

## Document Upload

```http
POST /api/upload
```

Uploads, parses, chunks, embeds, and stores a document.

## Documents

```http
GET /api/documents
```

Retrieves uploaded document information.

## Chat

```http
POST /api/chat
```

Processes document-based AI questions.

The application also supports a streaming chat endpoint used by the frontend for progressive AI responses.

## Conversations

```http
/api/conversations
```

Manages persistent AI research conversations.

## History

```http
/api/history
```

Manages stored chat history.

## Backend Health Check

```http
GET /
```

Returns the current backend status.

---

# 📁 Project Structure

```text
IBM/
│
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── uploads/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── package-lock.json
│
├── docs/
├── docker/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🛠️ Local Installation

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- Docker Desktop (for containerized execution)

You also need access to:

- MongoDB
- Groq API
- Hugging Face API

---

## Clone the Repository

```bash
git clone <your-repository-url>

cd IBM
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

HF_TOKEN=your_hugging_face_token

JWT_SECRET=your_secure_random_secret
```

Never commit the `.env` file to version control.

Start the backend:

```bash
npm start
```

The backend runs locally on:

```text
http://localhost:5001
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The development frontend runs on:

```text
http://localhost:5173
```

By default, the frontend connects to:

```text
http://localhost:5001
```

A custom backend URL can be configured using:

```env
VITE_API_URL=your_backend_url
```

---

# 🐳 Docker

The project includes Docker support for both the frontend and backend.

The frontend is built with Node.js and served in production using Nginx.

The backend runs as a Node.js Express container.

## Build Docker Images

From the project root:

```bash
docker compose build
```

## Start the Application

```bash
docker compose up -d
```

The Dockerized application is available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:5001
```

## Check Running Containers

```bash
docker compose ps
```

## View Backend Logs

```bash
docker compose logs -f backend
```

## Stop Containers

```bash
docker compose down
```

Sensitive backend environment variables are injected into the backend container at runtime and are not copied into the Docker image.

---

# 🔐 Security

The project follows basic security best practices:

- API keys are stored only in backend environment variables
- `.env` files are excluded from Git
- API credentials are not exposed to frontend code
- Docker images exclude `.env` files
- MongoDB credentials are stored through environment variables
- Production frontend origins can be configured through `FRONTEND_URL`

Files such as the following should never be committed:

```text
.env
.env.*
node_modules/
uploads/
```

---

# 🚀 Deployment

The application is designed for cloud deployment.

Planned deployment architecture:

```text
Frontend
   │
   └── Vercel
          │
          │ HTTPS
          ▼
Backend
   │
   └── Render
          │
          ├── Groq API
          ├── Hugging Face API
          └── MongoDB Atlas
```

Deployment environment variables should be configured through the hosting platform's secure environment variable settings.

---

# 📅 Development Status

## Completed

- [x] Responsive React frontend
- [x] Node.js Express backend
- [x] Document upload
- [x] PDF parsing
- [x] DOCX parsing
- [x] TXT parsing
- [x] Markdown processing
- [x] Document chunking
- [x] Hosted Hugging Face embeddings
- [x] Persistent MongoDB vector storage
- [x] Semantic similarity retrieval
- [x] Multi-document RAG
- [x] Single-document RAG
- [x] Groq hosted LLM integration
- [x] Streaming AI responses
- [x] Source references
- [x] Conversation persistence
- [x] Dockerized frontend
- [x] Dockerized backend
- [x] Docker Compose local deployment

## In Progress / Planned

- [ ] MongoDB Atlas native Vector Search
- [ ] Production cloud deployment
- [ ] Authentication and authorization
- [ ] AI document summaries
- [ ] Flashcard generation
- [ ] Quiz generation
- [ ] Export research notes
- [ ] Automated deployment pipeline

---

# ⚠️ Current Retrieval Architecture

For the current project scale, semantic retrieval is performed by loading stored document embeddings from MongoDB and calculating cosine similarity in the backend.

This approach works well for small research document collections and allows persistent RAG without requiring a local vector database.

For larger production deployments, the retrieval layer can be upgraded to MongoDB Atlas Vector Search to perform similarity search directly within the database.

---

# 👥 Team

This project includes work across:

- Frontend Development
- Backend Development
- AI / RAG Integration
- Database Integration
- UI/UX Design
- Containerization
- Cloud Deployment

---

# 📄 License

This project is developed for educational and research purposes.