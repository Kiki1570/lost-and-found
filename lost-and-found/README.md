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
│   ├── middleware/   # Auth, upload middleware
│   ├── uploads/      # Local image storage
│   ├── .env          # Environment variables
│   └── server.js     # Entry point
└── frontend/         # React + Vite + Tailwind CSS
    ├── src/
    │   ├── pages/    # All page components
    │   ├── components/ # Reusable components
    │   ├── context/  # Auth context
    │   └── utils/    # API client, helpers
    └── vite.config.js
```

## Setup & Running

### Step 1 — Start MongoDB

Make sure MongoDB is running locally:
```bash
# Windows (if installed as service, it may auto-start)
# Or run: mongod
```

Or update `MONGO_URI` in `backend/.env` to a MongoDB Atlas connection string.

### Step 2 — Start Backend

```bash
cd lost-and-found/backend
npm install         # if not done yet
npm run dev         # starts on http://localhost:5000
```

### Step 3 — Start Frontend

```bash
cd lost-and-found/frontend
npm install         # if not done yet
npm run dev         # starts on http://localhost:3000
```

### Step 4 — Open in Browser

Visit: **http://localhost:3000**

The frontend proxies `/api` requests to `http://localhost:5000` automatically.

---

## Features

### Core Features
- ✅ User registration with legal agreement acceptance (Privacy Policy + Terms of Service)
- ✅ Secure login with JWT + httpOnly cookies + bcrypt password hashing
- ✅ Account lockout after 5 failed login attempts
- ✅ Rate limiting on all API endpoints (stricter on auth routes)
- ✅ CORS, Helmet security headers
- ✅ Post lost items with: title, description, category, photos (up to 5), location, date, contact info, reward option, police report reference
- ✅ Post found items with: same detail + handover location + authority info
- ✅ Categories: Passport, National ID, Car Licence, Driver's Licence, Wallet, Phone, Keys, Bag, Jewelry, Electronics, Documents, Clothing, Pet, Vehicle, Other
- ✅ Search & filter by category, city, keyword
- ✅ Pagination
- ✅ User dashboard — manage your posts
- ✅ Mark lost items as found / Claim found items
- ✅ Report posts (fraud, fake listing, spam, etc.)
- ✅ View count tracking on posts
- ✅ User profile management with avatar upload
- ✅ Account deletion
- ✅ Admin/moderator report management
- ✅ Privacy Policy & Terms of Service pages
- ✅ Home, About, Lost, Found, Dashboard, Profile pages

### Security
- Passwords: bcrypt with 12 salt rounds
- Tokens: JWT stored in httpOnly, secure, SameSite cookies
- Rate limiting: 100 req/15min general, 10 req/15min on login/register
- Helmet.js security headers
- Input validation with express-validator
- Contact details only visible to logged-in users
- Posts expire after 90 days

---

## Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/lostandfound
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Deployment (Production)

### Backend
- Deploy to: Railway, Render, Heroku, AWS, VPS
- Set `NODE_ENV=production`
- Use MongoDB Atlas for database
- Set real `JWT_SECRET` (32+ random chars)

### Frontend
- Build: `npm run build`
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Update `FRONTEND_URL` in backend `.env` to your deployed domain
- Update Vite proxy config or use environment variable for API URL

### Cloudinary (Image Uploads in Production)
1. Create free account at cloudinary.com
2. Add credentials to `backend/.env`
3. Update `middleware/upload.js` to use Cloudinary storage

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| POST | /api/auth/logout | ✓ | Logout |
| GET | /api/auth/me | ✓ | Get current user |
| GET | /api/lost | — | Get all lost items |
| POST | /api/lost | ✓ | Create lost post |
| GET | /api/lost/:id | — | Get single lost item |
| DELETE | /api/lost/:id | ✓ | Delete own post |
| PATCH | /api/lost/:id/found | ✓ | Mark as found |
| GET | /api/found | — | Get all found items |
| POST | /api/found | ✓ | Create found post |
| PATCH | /api/found/:id/claim | ✓ | Claim found item |
| GET | /api/users/profile | ✓ | Get profile |
| PUT | /api/users/profile | ✓ | Update profile |
| DELETE | /api/users/me | ✓ | Delete account |
| POST | /api/reports | ✓ | Submit report |
| GET | /api/reports | Admin | View all reports |
