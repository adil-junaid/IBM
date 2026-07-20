# 📚 AI Research & Document Assistant

An AI-powered **Research and Document Assistant** built using **Retrieval-Augmented Generation (RAG)**.

The application allows authenticated users to upload research documents and interact with their content through an AI-powered chat interface.

Documents are parsed, split into chunks, converted into vector embeddings, and stored persistently in MongoDB Atlas. When a user asks a question, the application retrieves relevant document chunks and provides them as context to a hosted Large Language Model (LLM).

The system supports secure multi-user authentication, isolated document storage, multi-document research, document-specific querying, persistent conversations, source references, and real-time streaming AI responses.

---

# 🌐 Live Application

The application is deployed and available online:

**Live Demo:**

https://ibm-ai-research-assistant.vercel.app

### Production Architecture

- **Frontend:** Vercel
- **Backend:** Render
- **Authentication:** Clerk
- **Database:** MongoDB Atlas
- **LLM:** Groq API
- **Embeddings:** Hugging Face Inference API

---

# 🚀 Features

## 🔐 Authentication & Multi-User Security

- Secure user authentication using Clerk
- User sign-in and account management
- Protected backend API routes
- Clerk session token verification
- Bearer-token authenticated API requests
- Per-user document isolation
- Per-user document chunk and embedding isolation
- Per-user RAG retrieval
- Per-user conversation isolation
- Per-user chat history isolation
- Users cannot access or query another user's documents

Each authenticated user's data is isolated using their Clerk user ID.

```text
Authenticated User
        │
        ▼
User Documents
        │
        ▼
User Document Chunks
        │
        ▼
User-Specific RAG Retrieval
        │
        ▼
User Conversations
        │
        ▼
User Chat History
```

---

## 📄 Document Management

- Upload research documents
- PDF document support
- DOCX document support
- TXT document support
- Markdown document support
- Drag-and-drop file upload
- Multiple document support
- Persistent document metadata
- Document-specific querying
- Search across all documents belonging to the authenticated user
- Secure user-specific document deletion

---

## 🤖 AI Research Assistant

- Chat with uploaded research documents
- Retrieval-Augmented Generation (RAG)
- Context-aware AI responses
- Multi-document retrieval
- Single-document retrieval
- Semantic similarity search
- Source references
- Markdown response rendering
- Persistent conversation history
- User-isolated AI retrieval

The AI only retrieves document chunks belonging to the currently authenticated user.

---

## ⚡ Real-Time Streaming

AI responses are streamed progressively from the backend to the frontend.

Instead of waiting for the complete response to be generated, users can see the answer appear in real time as tokens are produced by the language model.

---

## 🔍 Semantic Retrieval

The application uses vector embeddings to find document chunks that are semantically related to the user's question.

The current retrieval pipeline uses:

- Hugging Face hosted embeddings
- `sentence-transformers/all-MiniLM-L6-v2`
- 384-dimensional embedding vectors
- Persistent vector storage in MongoDB Atlas
- Cosine similarity retrieval
- User-specific retrieval filtering
- Multi-document semantic search
- Document-specific semantic search

Native MongoDB Atlas Vector Search can be integrated as a future optimization for larger-scale deployments.

---

## 💬 Conversation Management

- Create conversations
- Store user and assistant messages
- Maintain persistent conversation history
- Associate conversations with selected documents
- Continue previous research conversations
- Edit user messages and regenerate AI responses
- Delete conversations
- Clear conversation messages
- User-specific conversation isolation

Each conversation belongs only to the authenticated user who created it.

---

# 🏗️ System Architecture

```text
                     ┌────────────────────────┐
                     │      React Frontend    │
                     │   Vite + Tailwind CSS  │
                     │       on Vercel        │
                     └────────────┬───────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │   Clerk Authentication │
                     │   Session / JWT Token  │
                     └────────────┬───────────┘
                                  │
                                  │ HTTPS
                                  │ Authorization: Bearer Token
                                  ▼
                     ┌────────────────────────┐
                     │    Express Backend     │
                     │   Node.js on Render    │
                     └────────────┬───────────┘
                                  │
                     Clerk Token Verification
                                  │
                                  ▼
                         Authenticated User ID
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
          Document Parser   Hugging Face       Groq API
                 │           Embeddings           LLM
                 │                │                │
                 ▼                ▼                │
              Chunks        384D Vectors          │
                 │                │                │
                 └────────┬───────┘                │
                          ▼                        │
                    MongoDB Atlas                  │
                          │                        │
                     Filter by User                │
                          │                        │
                          ▼                        │
                   Cosine Similarity               │
                          │                        │
                          ▼                        │
                   Relevant Context ───────────────┘
                          │
                          ▼
                   Streaming AI Answer
                          │
                          ▼
                    React Frontend
```

---

# 🧠 RAG Workflow

```text
User Authenticates with Clerk
        │
        ▼
Clerk User ID Identified
        │
        ▼
Upload Document
        │
        ▼
Associate Document with User ID
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
Store User ID + Chunks + Vectors
in MongoDB Atlas
        │
        ▼
User Asks a Question
        │
        ▼
Verify Clerk Authentication
        │
        ▼
Generate Question Embedding
        │
        ▼
Filter Chunks by User ID
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
Stream AI Response
        │
        ▼
Save User-Specific Conversation
```

---

# 💻 Frontend

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Clerk React
- Framer Motion
- Lucide React
- React Icons
- React Markdown
- React Dropzone
- React Hot Toast

The frontend provides a responsive research dashboard with:

- Authentication
- Protected dashboard access
- Document management
- AI chat
- Conversation history
- Source references
- Real-time streamed responses
- User account management

Clerk session tokens are automatically attached to authenticated API requests.

---

# ⚙️ Backend

## Tech Stack

- Node.js
- Express.js
- Clerk Express
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

- Clerk authentication verification
- Protected API routing
- User-specific data isolation
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

# 🔐 Authentication

Authentication is implemented using Clerk.

The frontend retrieves the authenticated user's Clerk session token and sends it to protected backend endpoints using:

```http
Authorization: Bearer <clerk-session-token>
```

The Express backend verifies authentication using Clerk middleware.

After successful authentication, the Clerk user ID is used to isolate user data.

Example:

```text
Account A
├── Documents A
├── Embeddings A
├── Conversations A
└── Chat History A

Account B
├── Documents B
├── Embeddings B
├── Conversations B
└── Chat History B
```

Account A cannot access or retrieve Account B's data.

---

# 🤖 AI Integration

## Large Language Model

The application uses a hosted LLM through the Groq API.

The current model is configured through:

```env
GROQ_MODEL=llama-3.1-8b-instant
```

The model configuration can be changed using environment variables without exposing credentials to the frontend.

---

## Embedding Model

Document and query embeddings are generated using:

```text
sentence-transformers/all-MiniLM-L6-v2
```

Embedding dimension:

```text
384
```

Embeddings are generated through the Hugging Face hosted inference endpoint.

This removes the requirement for a locally running embedding model.

---

# 🗄️ Database

MongoDB Atlas is used for persistent application storage.

The application stores:

- User-owned document metadata
- User-owned document chunks
- Vector embeddings
- Conversations
- Conversation messages
- Chat history

User ownership is associated with stored data using the authenticated Clerk user ID.

Unlike an in-memory vector store, uploaded document embeddings remain available after backend restarts or redeployments.

---

# 📡 Main API Routes

Protected routes require a valid Clerk authentication token.

## Document Upload

```http
POST /api/upload
```

Uploads, parses, chunks, embeds, and stores a document for the authenticated user.

---

## Documents

```http
GET /api/documents
```

Retrieves documents belonging only to the authenticated user.

```http
DELETE /api/documents/:name
```

Deletes a user-owned document and its associated chunks.

---

## Chat

```http
POST /api/chat
```

Processes authenticated document-based AI questions.

```http
POST /api/chat/stream
```

Streams AI-generated responses progressively to the frontend.

---

## Conversations

```http
GET /api/conversations
```

Retrieves conversations belonging to the authenticated user.

Additional conversation endpoints support:

- Retrieving one conversation
- Deleting conversations
- Clearing conversation messages
- Editing messages
- Regenerating AI responses

---

## History

```http
GET /api/history
```

Retrieves the authenticated user's chat history.

History endpoints also support deleting individual history records and clearing the current user's history.

---

## Backend Health Check

```http
GET /
```

Returns the current backend status.

The health-check endpoint remains publicly accessible for deployment monitoring.

---

# 📁 Project Structure

```text
IBM/
│
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   ├── documentStore.js
│   │   │   ├── llm.js
│   │   │   ├── prompt.js
│   │   │   ├── rag.service.js
│   │   │   └── retriever.js
│   │   │
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   │
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
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   │
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vercel.json
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
- Docker Desktop (optional for containerized execution)

You also need access to:

- MongoDB Atlas
- Groq API
- Hugging Face API
- Clerk

---

# 📥 Clone the Repository

```bash
git clone https://github.com/adil-junaid/IBM.git

cd IBM
```

---

# ⚙️ Backend Setup

Navigate to the backend:

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

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Use the exact MongoDB environment variable name expected by your database configuration.

Never commit `.env` files or secret keys to version control.

Start the backend:

```bash
npm run dev
```

The backend runs locally on:

```text
http://localhost:5001
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5001
```

For local development, `VITE_API_URL` may be omitted if the application already falls back to:

```text
http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

The development frontend normally runs on:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may automatically use another port such as:

```text
http://localhost:5174
```

The corresponding frontend origin must be allowed by the backend CORS configuration.

---

# 🐳 Docker

The project includes Docker support for both the frontend and backend.

The frontend can be built with Node.js and served using Nginx.

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

# 🔒 Security

The application implements authentication and user-level data isolation.

Security measures include:

- Clerk authentication
- Clerk session-token verification
- Protected backend API routes
- Bearer-token authenticated requests
- Per-user document ownership
- Per-user document chunk ownership
- Per-user embedding retrieval
- Per-user RAG retrieval
- Per-user conversation storage
- Per-user chat history
- Ownership verification during document deletion
- API keys stored only in backend environment variables
- `.env` files excluded from Git
- Backend secrets never exposed to frontend code
- MongoDB credentials stored through environment variables
- CORS restricted to approved frontend origins

The Clerk secret key must only exist in the backend environment.

Never expose:

```text
CLERK_SECRET_KEY
GROQ_API_KEY
HF_TOKEN
MongoDB credentials
```

Files such as the following should never be committed:

```text
.env
.env.local
.env.*.local
node_modules/
uploads/
```

---

# 🚀 Production Deployment

The application is deployed using the following architecture:

```text
                    User
                      │
                      ▼
             Vercel Frontend
                      │
                      ▼
             Clerk Authentication
                      │
                      ▼
          Authenticated HTTPS Request
                      │
                      ▼
              Render Backend
                      │
          ┌───────────┼───────────┐
          │           │           │
          ▼           ▼           ▼
     MongoDB       Groq API    Hugging Face
      Atlas           LLM       Embeddings
```

## Frontend

Hosted on Vercel.

Production URL:

```text
https://ibm-ai-research-assistant.vercel.app
```

Required frontend environment variables:

```env
VITE_API_URL=your_render_backend_url
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

The project includes `vercel.json` to support React Router SPA routing on Vercel.

---

## Backend

Hosted on Render.

Required backend environment variables include:

```env
MONGO_URI=your_mongodb_connection_string

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

HF_TOKEN=your_hugging_face_token

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

FRONTEND_URL=https://ibm-ai-research-assistant.vercel.app
```

Production secrets should be configured through the hosting platform's environment-variable settings and must never be committed to GitHub.

---

# 📅 Development Status

## ✅ Completed

- [x] Responsive React frontend
- [x] Node.js Express backend
- [x] Document upload
- [x] PDF parsing
- [x] DOCX parsing
- [x] TXT parsing
- [x] Markdown processing
- [x] Document chunking
- [x] Hosted Hugging Face embeddings
- [x] Persistent MongoDB Atlas vector storage
- [x] Semantic similarity retrieval
- [x] Multi-document RAG
- [x] Single-document RAG
- [x] Groq hosted LLM integration
- [x] Streaming AI responses
- [x] Source references
- [x] Conversation persistence
- [x] Message editing and AI response regeneration
- [x] Clerk authentication
- [x] Protected backend API routes
- [x] Per-user document isolation
- [x] Per-user document chunk isolation
- [x] Per-user RAG retrieval
- [x] Per-user conversation isolation
- [x] Per-user chat history isolation
- [x] Dockerized frontend
- [x] Dockerized backend
- [x] Docker Compose local deployment
- [x] Vercel frontend deployment
- [x] Render backend deployment
- [x] Production cloud deployment
- [x] Vercel SPA routing support

## 🔮 Future Improvements

- [ ] MongoDB Atlas native Vector Search
- [ ] Advanced retrieval reranking
- [ ] Improved cross-document summarization
- [ ] AI-generated document summaries
- [ ] Flashcard generation
- [ ] Quiz generation
- [ ] Export research notes
- [ ] Automated CI/CD pipeline
- [ ] Improved production monitoring
- [ ] Advanced document analytics

---

# ⚠️ Current Retrieval Architecture

For the current project scale, semantic retrieval is performed by loading the authenticated user's stored document embeddings from MongoDB and calculating cosine similarity in the backend.

The retrieval process is user-isolated:

```text
Question
   │
   ▼
Authenticated User ID
   │
   ▼
Selected Document / All User Documents
   │
   ▼
Load User-Owned Chunks
   │
   ▼
Generate Query Embedding
   │
   ▼
Cosine Similarity
   │
   ▼
Retrieve Relevant Chunks
   │
   ▼
Build RAG Context
   │
   ▼
Generate AI Answer
```

This approach works well for small and medium-sized research document collections while providing persistent RAG capabilities without requiring a separate vector database.

For larger production deployments, the retrieval layer can be upgraded to MongoDB Atlas Vector Search to perform similarity searches directly within the database.

---

# 👥 Team

This project includes work across:

- Frontend Development
- Backend Development
- AI / RAG Integration
- Authentication & Security
- Database Integration
- UI/UX Design
- Containerization
- Cloud Deployment

---

# 📄 License

This project is developed for educational and research purposes.