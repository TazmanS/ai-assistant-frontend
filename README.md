# Yevhen AI — AI Assistant

A React, TypeScript, and Tailwind frontend for a streaming AI assistant. It includes a responsive workspace shell, backend health indicator, conversation UI, cancellation, and visible request errors.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A backend that provides `GET /api/health` and `POST /api/chat`

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

The Vite development server proxies `/api/*` to `http://localhost:8000` by default. Set `VITE_API_PROXY_TARGET` in `.env.local` if your backend listens elsewhere.

## API contract

`POST /api/chat` accepts JSON:

```json
{ "message": "Hello" }
```

The response may be a JSON object with a string `message` field, plain text (`text/plain`), or Server-Sent Events (`text/event-stream`). JSON responses are displayed after the request completes; text and SSE responses are rendered as they stream in. For SSE, each event's `data` may be plain text or JSON with a `delta`, `token`, `content`, `text`, or `message` field. OpenAI-style `choices[0].delta.content` is also supported. The plain-text stream may emit `\n[RESPONSE_TRUNCATED]` when the model reaches its output-token limit; the UI removes the marker and shows a response-limit notice. The client checks HTTP status codes and displays failures in the chat UI.

`GET /api/health` should return a successful HTTP status while the backend is healthy. The frontend checks it on startup and every 30 seconds while the page is visible.

## Production deployment

Build the static frontend with:

```sh
npm run build
```

Serve the generated `dist/` directory over HTTPS. Configure the web server to rewrite unknown page paths (such as `/chat`, `/library`, and `/explore`) to `index.html` so browser navigation works on direct loads and refreshes. Also configure the web server or ingress to proxy `/api/*` to the backend on the same origin. This keeps browser requests same-origin and avoids exposing backend credentials in frontend code. If the API must use a separate origin, set `VITE_API_BASE_URL` at build time and configure the backend's CORS policy for the deployed frontend origin.

Never put private keys or secrets in `VITE_*` variables; Vite embeds them in the browser bundle.
