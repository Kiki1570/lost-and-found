# Lost & Found Platform

A full-stack web application for reporting lost items and announcing found belongings. Built with Node.js + Express backend and React + Tailwind CSS frontend.

## Prerequisites

- **Node.js** v18+
- **MongoDB** — Install from https://www.mongodb.com/try/download/community
  - OR use a free cloud DB: https://www.mongodb.com/cloud/atlas (free tier)

## Project Structure

```
lost-and-found/
├── backend/          # Node.js + Express + MongoDB API
│   ├── controllers/  # Route handlers
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── middleware/  # Auth, upload middleware
│   ├── uploads/      # Local image storage
│   ├── .env          # Local environment variables (not committed)
│   └── server.js     # Entry point
└── frontend/         # React + Vite + Tailwind CSS frontend
    ├── src/
    └── vite.config.js
```

## Setup & Running Locally

### Step 1 — Configure MongoDB

Create `backend/.env` from `backend/.env.example`. Set `MONGO_URI` to your local MongoDB URL or your private MongoDB Atlas connection string.

### Step 2 — Start Backend

```bash
cd lost-and-found/backend
npm install
npm run dev
``

The API runs on http://localhost:5000.

### Step 3 — Start Frontend

In a second terminal:

```bash
cd lost-and-found/frontend
npm install
npm run dev
``

Open http://localhost:3000. Vite proxies local `/api` and `/uploads` requests to the backend.

---

## Render Deployment

A root-level `render.yaml` is included for a two-service Render deployment:

- **Backend web service:** `lost-and-found-api`
- **Frontend static site:** `lost-and-found-frontend`

### Recommended: deploy with the Blueprint

1. In Render, choose **New → Blueprint** and select this GitHub repository and the `master` branch.
2. Render reads the root `render.yaml` and configures both services with the correct project folders and build commands.
3. When prompted, provide `MONGO_URI` using your MongoDB Atlas connection string. Keep it private.
4. The Blueprint generates `JWT_SECRET` for the backend. Do not put secrets in GitHub.
5. Make sure MongoDB Atlas Network Access allows connections from Render. For a temporary demo setup, a broad IP rule can work, but it permits connections from any IP; use a strong database password and narrow the rule when possible.
6. Wait for both services to finish deploying.

The Blueprint expects these service URLs:
- Frontend: https://lost-and-found-frontend.onrender.com
- Backend: https://lost-and-found-api.onrender.com

If Render assigns different service URLs, update both values to match:
- Backend `FRONTEND_URL` = the exact frontend origin, with no trailing slash.
- Frontend `VITE_API_URL` = the backend origin, with no trailing slash and **without** `/api`.

### If the Render services already exist

Do not create duplicate services. Update the existing services to use these settings:

**Backend web service**
- Root Directory: `lost-and-found/backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Environment: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and `FRONTEND_URL`.

**Frontend static site**
- Root Directory: `lost-and-found/frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Environment: `VITE_API_URL` = backend origin (no trailing slash, no `/api`).

The frontend API client appends `/api` automatically. The Render rewrite rule in `render.yaml` also supports React Router page refreshes.

### Deployment checks

- Open `https://YOUR-BACKEND.onrender.com/api/health`. It should return JSON confirming that the API is running.
- Open the frontend URL and test registration/login and loading the lost/found lists.
- If the backend logs show MongoDB connection errors, check the Atlas URI, database username/password, and Atlas Network Access.
- If browser requests show CORS errors, make sure backend `FRONTEND_URL` exactly matches the frontend origin.
- If API requests go to the wrong address, check frontend `VITE_API_URL` and redeploy the frontend after changing it.

## Environment Variables

Create `backend/.env` locally from `backend/.env.example`. On Render, configure values in the service's Environment settings instead of committing a `.env` file.

Required backend production variables:

```text
MONGO_URI=<your-private-mongodb-atlas-uri>
JWT_SECRET=<a-long-random-secret>
NODE_ENV=production
FRONTEND_URL=https://your-frontend.onrender.com
```

The frontend production variable is:

```text
VITE_API_URL=https://your-backend.onrender.com
```

Do not commit real credentials. If a credential was ever committed to a public repository, rotate it; deleting the file in a later commit does not remove it from Git history.

## Cloudinary (Optional for Persistent Image Uploads)

The current upload middleware stores files on the server when Cloudinary is not configured. Files stored on a Render instance's local filesystem may not persist across redeploys. Configure Cloudinary for persistent image storage before relying on uploaded images in production.

## Features

- User registration and login with password hashing and JWT authentication
- Lost and found item listings, search, and filters
- User dashboard and profile management
- Reports and admin/moderator report management
- Image uploads
- Privacy Policy and Terms of Service pages
