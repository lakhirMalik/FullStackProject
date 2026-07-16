# Full-Stack Auth App (React + Node.js + MongoDB)

## Structure
```
project/
├── backend/     ← Express + MongoDB API
└── frontend/    ← React (Vite) app
```

## Setup

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:5000`. Make sure MongoDB is running first (`mongosh` should connect without error).

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

Open `http://localhost:5173` in your browser — it redirects to `/login`.

## How it all connects

- **Backend** (`backend/`) — same auth logic you already know: register, login, forgot/reset password, all using bcrypt + JWT + Mongoose. New addition: `middleware/verifyToken.js` protects the `/api/auth/profile` route.
- **Frontend** (`frontend/`) — React app using:
  - `api/axiosInstance.js` — the middleware: request interceptor attaches the JWT automatically, response interceptor auto-logs-out on `401`
  - `api/authService.js` — wraps backend endpoints into simple functions
  - `context/AuthContext.jsx` — tracks logged-in user across the whole app
  - `components/ProtectedRoute.jsx` / `PublicOnlyRoute.jsx` — guard routes based on login state
  - `pages/` — Login, Register, ForgotPassword, ResetPassword, Dashboard

## Testing the full flow

1. Go to `http://localhost:5173/register` → create an account
2. Get redirected to `/login` → log in
3. Get redirected to `/dashboard` → this page calls the **protected** `/api/auth/profile` route, proving the JWT + interceptor + middleware chain all work together
4. Click Logout → redirected back to `/login`
5. Try visiting `/dashboard` directly while logged out → `ProtectedRoute` blocks it and redirects to `/login`
6. While logged in, try visiting `/login` directly → `PublicOnlyRoute` blocks it and redirects to `/dashboard`


