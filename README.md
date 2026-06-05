# Gen-AI

Gen-AI is a simple Node.js + Express backend that sends user messages to Google Gemini and returns the generated response.

## What it does

- Accepts a message through a JSON API
- Sends the message to Gemini using `@google/genai`
- Returns the model response as JSON

## Tech Stack

- Node.js
- Express
- Google Gen AI SDK
- dotenv

## Project Structure

- `index.js` - Express server and API route
- `AI.js` - Gemini integration and response handling
- `.env` - environment variables for the API key and model

## Prerequisites

- Node.js installed
- A Google Gemini API key

## Environment Variables

Create a `.env` file in the project root with:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=your_model_name_here
PORT=3000
```

## Installation

```bash
npm install
```

## Run the Server

```bash
node index.js
```

The server starts on `http://localhost:3000` by default, or on the port defined in `PORT`.

## API Reference

### POST `/api/message`

Send a message to the AI and receive the generated response.

Request body:

```json
{
  "message": "Explain artificial intelligence in simple terms"
}
```

Success response:

```json
{
  "response": "...generated text..."
}
```

Error responses:

- `400 Bad Request` when `message` is missing
- `500 Internal Server Error` when the model request fails

## Example Request

```bash
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Write a short intro about AI\"}"
```

## Notes

- Make sure `GEMINI_API_KEY` and `GEMINI_MODEL` are set before starting the server.
- The project currently exposes only the backend API; there is no frontend in this folder.

## Frontend

A simple React + Vite chatbot frontend now lives in the `Frontend` folder.

```bash
cd Frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:3000`, so start the backend first, then open the frontend in the browser.
