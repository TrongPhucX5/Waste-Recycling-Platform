# Frontend — Waste Platform

Next.js 14 (App Router) frontend for the Waste Recycling Platform.

## Structure

```
frontend/
└── src/
    ├── app/
    │   ├── (auth)/        # /login, /register
    │   ├── (citizen)/     # /reports, /rewards
    │   ├── (enterprise)/  # /reports, /tasks
    │   ├── (collector)/   # /tasks
    │   └── (admin)/       # /users
    ├── components/        # Reusable UI components
    ├── hooks/             # Custom React hooks
    ├── lib/api/           # API client modules
    ├── store/             # Zustand stores
    └── types/             # TypeScript type definitions
```

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- Backend API running (see `../backend/README.md`)

## Running Locally

```bash
# From repo root — copy environment file
cp .env.example .env
# Set NEXT_PUBLIC_API_URL=http://localhost:8080 in .env

cd frontend
npm install
npm run dev
```

App available at **http://localhost:3000**

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:8080`) |

## Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Create optimized production build
npm run start    # Start the production server
```

## Building for Production

```bash
npm run build
npm run start
```

Or use the multi-stage Dockerfile:

```bash
docker build -t waste-frontend .
```
