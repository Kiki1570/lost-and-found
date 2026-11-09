# FindIt — Lost and Found

A beginner-friendly Lost and Found website built with React, Express and MongoDB.

## Features
- Register and log in
- Post lost and found items
- Browse, search and filter posts
- Delete your own posts
- Responsive design for phones and computers

## Project folders
```
lost-and-found/
  backend/
    models/
    middleware/
    routes/
    server.js
    .env.example
  frontend/
    src/
      App.jsx
      index.css
      main.jsx
      utils/api.js
  render.yaml
```

## 1. Clone the project

```bash
git clone https://github.com/Kiki1570/lost-and-found.git
cd lost-and-found
git checkout beginner-friendly-rebuild
cd lost-and-found/backend
npm install
```

Open a second terminal and install the frontend:

```bash
cd lost-and-found/lost-and-found/frontend
npm install
```

## 2. Connect MongoDB Atlas

1. Create a free cluster in MongoDB Atlas.
2. Create a database user and add your computer's IP address in Network Access.
3. Copy the MongoDB connection string from **Connect → Drivers**.
4. In `lost-and-found/backend`, copy `.env.example` to a new file named `.env`.
5. Put your private Atlas connection string in `MONGO_URI` and create a long random value for `JWT_SECRET`.

Example:
```env
PORT=5000
MONGO_URI=your_private_mongodb_connection_string
JWT_SECRET=your_long_random_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Never commit your real `.env` file or share your database password.

## 3. Run locally

Terminal 1:
```bash
cd lost-and-found/backend
npm run dev
```

Terminal 2:
```bash
cd lost-and-found/frontend
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## 4. Deploy on Render

The root `render.yaml` is set up for a Render Blueprint with two services.

1. Open Render and choose **New → Blueprint**.
2. Connect this GitHub repository.
3. Select the `beginner-friendly-rebuild` branch.
4. Render reads `render.yaml` and creates the backend and frontend services.
5. When prompted, enter your MongoDB Atlas URI as `MONGO_URI`. Keep it private.
6. Render generates `JWT_SECRET` automatically.
7. Confirm the service URLs match `FRONTEND_URL` and `VITE_API_URL`. If Render gives different URLs, update the environment values and redeploy.

Backend health check: `https://YOUR-BACKEND.onrender.com/api/health`.

## Environment variables

Backend: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`, `FRONTEND_URL`.

Frontend: `VITE_API_URL` (backend URL without `/api`).

**Important:** the old version of this repository previously contained an environment file in Git history. Rotate any database passwords or API secrets that were ever committed, even if the file has since been removed.
