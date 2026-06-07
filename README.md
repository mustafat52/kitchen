# Kitchen Cleaning Task Manager
**Ashara 1448H London**

## Project Structure
```
nazafat-new/
├── client/   — React + Vite frontend (deploy to Vercel)
└── server/   — Node.js + Express + PostgreSQL API (deploy to Render)
```

---

## Local Development

### 1. Backend
```bash
cd server
cp .env.example .env        # fill in DATABASE_URL and JWT_SECRET
npm install
npm run db:seed             # create tables + seed 2 users
npm run dev                 # starts on port 3001
```

### 2. Frontend
```bash
cd client
npm install
npm run dev                 # starts on port 5173, proxies /api → 3001
```

### Login credentials (after seeding)
| Role       | ITS      | Password  |
|------------|----------|-----------|
| Zone Admin | 10000001 | 10000001  |
| Volunteer  | 10000002 | 10000002  |

---

## Production Deployment

### Backend → Render
1. Push code to GitHub
2. New Web Service on Render → connect repo → set root to `server/`
3. Build: `npm install` | Start: `npm start`
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`
5. Add a PostgreSQL database on Render (free tier)
6. Run seed: open Render shell → `npm run db:seed`

### Frontend → Vercel
1. New project on Vercel → connect repo → set root to `client/`
2. Add env variable: `VITE_API_URL=https://your-backend.onrender.com`
3. Deploy

---

## API Endpoints

| Method | Path                    | Auth       | Description              |
|--------|-------------------------|------------|--------------------------|
| POST   | /api/auth/login         | —          | Login with ITS + password|
| GET    | /api/auth/me            | Any        | Verify token + get user  |
| GET    | /api/tasks              | Any        | Get tasks                |
| POST   | /api/tasks              | zone_admin | Create task              |
| PATCH  | /api/tasks/:id/status   | Any        | Update task status       |
| DELETE | /api/tasks/:id          | zone_admin | Delete task              |
| GET    | /api/users/zone         | zone_admin | Get zone users           |
| GET    | /api/users/templates    | Any        | Get task templates       |
| POST   | /api/moods              | volunteer  | Submit mood              |
| GET    | /api/moods/my           | volunteer  | Get own mood             |
| GET    | /api/moods/summary      | zone_admin | Get mood summary         |
