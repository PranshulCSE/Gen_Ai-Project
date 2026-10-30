# Gen-AI

Gen-AI is a split full-stack chatbot project:

- a Node.js + Express backend that stores conversations and talks to Google Gemini
- a React + Vite frontend that renders the chat experience in a clean modular UI

The frontend has been reorganized into small modules so the app is easier to read, extend, and debug. The stylesheet remains a single file as requested.

## Highlights

- Chat conversations persist through the backend and browser storage
- Markdown replies render cleanly with GitHub-flavored Markdown support
- The frontend uses a simple architecture: hook for state, service for API calls, utilities for storage and formatting, and separate chat components
- Vite proxies `/api` to the backend so local development stays simple

## Project Layout

```text
Gen-AI/
├─ backend/
│  ├─ server.js
│  ├─ routes/
│  ├─ controllers/
│  ├─ services/
│  └─ models/
├─ Frontend/
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ components/chat/
│  │  ├─ hooks/
│  │  ├─ services/
│  │  ├─ utils/
│  │  └─ constants/
│  └─ src/styles.css
├─ index.js
└─ AI.js
```

## Frontend Architecture

The React app is now split like this:

- `src/App.jsx` keeps the page layout small and readable
- `src/hooks/useChatSession.js` owns chat state, loading, history sync, and reset behavior
- `src/services/chatApi.js` handles all API requests to the backend
- `src/components/chat/` contains the header, message list, and composer UI pieces
- `src/utils/storage.js` wraps browser storage access
- `src/utils/formatTime.js` formats message timestamps
- `src/constants/chatContent.js` holds copy and starter prompts

## Requirements

- Node.js 18 or newer
- A Google Gemini API key
- MongoDB available to the backend if your current backend config requires it

## Backend Setup

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=3000
```

Install backend dependencies and start the server:

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:3000` by default.

## Frontend Setup

Install frontend dependencies and start Vite:

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## Run Locally

Use two terminals:

1. Start the backend from `backend/`
2. Start the frontend from `Frontend/`
3. Open `http://localhost:5173` in your browser

If the Gemini API key is missing, the backend will stop on startup, so the frontend will still load but message requests will fail until the backend is configured.

## API Routes

The frontend uses these backend endpoints:

- `POST /api/chat/start` to create a conversation
- `POST /api/chat/message` to send a message
- `GET /api/chat/history/:id` to load saved history
- `DELETE /api/chat/:id` to remove a conversation

## Notes

- Public assets in Vite are case-sensitive in production.
- The frontend intentionally keeps one CSS file for simplicity.
- The root `index.js` and `AI.js` files are legacy references and the active backend is in `backend/server.js`.
