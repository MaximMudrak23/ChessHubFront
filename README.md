# ChessHub Frontend

Frontend for **ChessHub** — an online chess platform where players can compete against both humans and bots.

Bots have their own profiles and Elo ratings. Playing strength is configurable when supported by the engine. Matchmaking is handled by the ChessHub backend.

The project also includes player profile customization, an administration panel, a player search page, achievements, statistics, and real-time gameplay powered by WebSockets.

## Tech Stack

- React
- TypeScript
- Vite
- SCSS
- Socket.IO Client
- React Router
- Zustand
- Framer Motion
- Lottie React
- clsx

## How to run?

Run commands from root ChessHubFront directory.
Requires Node.js 20.x (20.19.0+) or 22.12.0+, npm, and a running ChessHub backend (`http://localhost:3000` by default).

### First time setup:

Install Node.js (includes npm). Install Git if you need to clone the repositories.

```bash
npm ci # First setup or after dependency/lockfile changes
```

**Start frontend** (each development session):

```bash
npm run dev
```

**After start**

- Browser: Open `http://localhost:5173` (or the URL displayed by Vite).

- Backend: API requests and Socket.IO connect directly to `VITE_API_URL` (`http://localhost:3000` by default). Set `VITE_API_URL` before starting Vite or building the frontend to use another address.

- Stop: Press `Ctrl+C` in the frontend terminal.

- Auto-restart: Changes in frontend source files are reflected automatically. No rebuild is needed during development.

**Warning:** Start ChessHubBack separately using its README instructions.

## Other
## Built image — no automatic restart

Build the frontend Docker image (adjust VITE_API_URL to the backend address reachable from your browser):

```bash
docker build --build-arg VITE_API_URL=http://localhost:3000 -t chesshub-front .
```

Run it (the backend must be reachable from your browser):

```bash
docker run --rm --name chesshub-front \
  -p 127.0.0.1:8080:80 chesshub-front
```

Open `http://localhost:8080`.

After code changes, rebuild the image and start a new container.

## Checks

```bash
npm run lint
npm run build
```

- lint — checks code for linting issues.
- build — checks and creates the production frontend bundle.