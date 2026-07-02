# ChessHub Frontend

Frontend for **ChessHub** — an online chess platform where players can compete against both humans and bots.

Unlike many chess websites, bots participate in the matchmaking system alongside regular players. Each bot has its own profile, Elo rating, and configurable playing strength. Matchmaking is based on Elo to provide balanced games.

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

## Requirements

Before running the project locally, install:

- Node.js
- Git

### Clone the repository

```bash
git clone https://github.com/MaximMudrak23/ChessHubFront.git
cd ChessHubFront
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

## Backend

This project requires the ChessHub backend to be running.