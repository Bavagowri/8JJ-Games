# 8JJ Games – Local Development Guide

This document explains how to start the **backend API** and **frontend React app** from scratch using separate terminals.

## Project Structure

- Backend API (Express): `server/`
- Frontend (React + Vite): `react-app/`

All commands below assume your current working directory is the project root:

```bash
cd /Users/*username*/Documents/GitHub/8jj-games
```

## 1. Prerequisites

- Node.js and npm installed (LTS version recommended)

First time on this machine, install dependencies once for both parts.

### Install backend dependencies

```bash
cd server
npm install
```

### Install frontend dependencies

```bash
cd ../react-app
npm install
```

After the first install, you usually do **not** need to repeat these steps unless `package.json` changes.

## 2. Environment Variables

### Frontend (`react-app/.env`)

For Google login you already have:

```env
VITE_GOOGLE_CLIENT_ID=728000620625-6vejjck0f9vi91msdqkcmapq1npkmplh.apps.googleusercontent.com
```

You can also optionally set:

```env
VITE_API_URL=http://localhost:5050
```

### Backend (`server/.env`)

The backend uses dotenv via `src/config/env.js`. Make sure a `.env` file exists in `server/` with your database and JWT settings. You are already able to run it locally, so you can keep your existing `.env` as is.

## 3. Starting the Backend (API Server)

Open a **new terminal**.

From the project root:

```bash
cd server
npm run dev
```

This runs:

- Node in watch mode on `src/server.js`
- Backend URL: `http://localhost:5050`

You can verify it is up by opening in a browser or using curl:

```bash
curl http://localhost:5050/health
```

You should see:

```json
{"status":"ok"}
```

Leave this terminal **running**.

## 4. Starting the Frontend (React + Vite)

Open a **second new terminal**.

From the project root:

```bash
cd react-app
npm run dev
```

Vite will start and show an URL similar to:

```text
Local:   http://localhost:5173/
```

Open the frontend in your browser:

- `http://localhost:5173/`

The frontend will talk to the backend at:

- `http://localhost:5050`

## 5. Stopping the Servers

To stop either server:

- Go to the terminal where it is running
- Press `Ctrl + C`

Do this in:

- The `server` terminal to stop the backend
- The `react-app` terminal to stop the frontend

## 6. Summary of Commands

From project root:

- **Backend (new terminal)**

  ```bash
  cd server
  npm run dev
  ```

- **Frontend (second new terminal)**

  ```bash
  cd react-app
  npm run dev
  ```
