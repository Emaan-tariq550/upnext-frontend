# UPNEXT Frontend — Become The Name Everyone Knows.

React (Vite) frontend for UPNEXT.

## Tech Stack
Vite, React 18, Tailwind CSS, Zustand, Framer Motion, React Hook Form, Axios, Socket.IO Client.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts
- `npm run dev` — start dev server (http://localhost:5173)
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Architecture
- `src/api/` — Axios instances + endpoint modules
- `src/store/` — Zustand state stores
- `src/components/ui/` — reusable design-system components
- `src/pages/` — route-level pages
- `src/routes/` — route guards (Protected / PublicOnly)
- `src/hooks/` — custom hooks (e.g. Socket.IO connection)

Auth uses JWT access tokens (in memory/localStorage) + httpOnly refresh token cookie, with automatic silent refresh via Axios interceptor.

## Docker

```bash
docker build -t upnext-frontend .
docker run -p 80:80 upnext-frontend
```