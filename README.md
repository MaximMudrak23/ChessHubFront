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

### Build Docker image

```bash
docker build --build-arg VITE_API_URL=http://192.168.1.8:3000 -t chesshub-front .
```

### Run Docker container

```bash
docker run -p 8080:80 chesshub-front
```

The server will be available at:

```
http://localhost:8080
```

### Rebuild Docker image

If Docker keeps using an old frontend build, find and remove the old container and image:

```bash
docker ps -a --filter ancestor=chesshub-front
docker rm -f CONTAINER_ID
docker rmi chesshub-front
```