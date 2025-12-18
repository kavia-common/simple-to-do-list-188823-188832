# Simple To‑Do List (React Frontend)

A lightweight single-page React app to manage tasks: add, edit, delete, and toggle completion.

## Features

- Clean modern light UI (no heavy UI frameworks)
- Add / edit (inline) / delete / toggle complete
- Optimistic UI updates
- **Storage provider auto-selection**
  - Uses REST backend if configured & reachable
  - Falls back to **localStorage** automatically if not configured or backend is down

## Backend Integration

The frontend expects the following REST endpoints:

- `GET /tasks` → returns `[{ id, title, completed }]`
- `POST /tasks` body `{ title, completed? }` → returns created task
- `PATCH /tasks/:id` body `{ title?, completed? }` → returns updated task
- `DELETE /tasks/:id` → 204 or 200

### Configure API Base URL

Set either:

- `REACT_APP_API_BASE`
- or `REACT_APP_BACKEND_URL`

Example:

```bash
cp .env.example .env
# then edit .env:
# REACT_APP_API_BASE=http://localhost:8000
```

If neither is set (or the backend is unreachable), the app will continue working using localStorage.

## Running

```bash
npm install
npm start
```

Open http://localhost:3000

## Notes

- This project intentionally keeps dependencies minimal.
- Error handling is non-intrusive: a small banner shows when backend sync fails, and the app continues locally.
