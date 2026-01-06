# Environment Variables Setup Guide

## Quick Setup

### 1. Frontend (.env in root directory)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

For **Local Development**, update with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyCp0PdBk9mEa_0kVQXQi_dVx5Aq5QqIVwY
VITE_FIREBASE_AUTH_DOMAIN=eyeq-web.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eyeq-web
VITE_FIREBASE_STORAGE_BUCKET=eyeq-web.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=462274604850
VITE_FIREBASE_APP_ID=1:462274604850:web:6bcbfbaf2bb7976ba9712b
VITE_FIREBASE_MEASUREMENT_ID=G-KKPSG916YR
```

### 2. Backend (backend/.env)

Copy `backend/.env.example` to `backend/.env`:
```bash
cd backend
cp .env.example .env
```

Update with your credentials:
```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

# Get from: Firebase Console → Project Settings → Service Accounts
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"eyeq-web",...}

# Get from: Supabase Dashboard → Project Settings → API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Should output: 🚀 Server running on http://localhost:5000

# Terminal 2 - Frontend  
npm install
npm run dev
# Navigate to http://localhost:8080
```

## Environment Variables Explained

### Frontend Variables (VITE_*)

All frontend variables are **PUBLIC** (safe to expose in code):
- `VITE_API_BASE_URL` - Backend API endpoint
  - Development: `http://localhost:5000/api`
  - Production: `https://eyeq-backend-lodl.onrender.com/api`
- `VITE_FIREBASE_*` - Firebase public credentials

### Backend Variables

**PRIVATE** (never expose in frontend):
- `FIREBASE_SERVICE_ACCOUNT_JSON` - Backend-only Firebase admin credentials
- `SUPABASE_SERVICE_KEY` - Backend-only database admin key

**PUBLIC** (backend config):
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed frontend origin

## Firebase Service Account Setup

1. Go to Firebase Console (https://console.firebase.google.com)
2. Select "eyeq-web" project
3. Settings → Service Accounts
4. Click "Generate New Private Key"
5. Copy the entire JSON content
6. Paste into `FIREBASE_SERVICE_ACCOUNT_JSON` env variable

## Supabase Keys Setup

1. Go to Supabase Dashboard (https://app.supabase.com)
2. Select your project
3. Settings → API
4. Copy `Project URL` → `SUPABASE_URL`
5. Copy `service_role` key → `SUPABASE_SERVICE_KEY`

## Verification

### Frontend
```bash
npm run dev
# Open DevTools → Network tab
# Verify API calls go to VITE_API_BASE_URL
# No localhost references in production build
```

### Backend
```bash
curl http://localhost:5000/
# Should return: { "message": "EyeQ Backend is running 🚀", ... }

curl http://localhost:5000/api/auth
# Should return 400 (no token provided) - not 404
```

## Common Issues

### "API calls going to localhost in production"
- Check Vercel environment variables
- Ensure `VITE_API_BASE_URL` is set to production backend URL
- Rebuild and redeploy

### "CORS error from frontend"
- Check backend `CORS_ORIGIN` env variable
- Ensure it matches frontend URL
- Restart backend server after changing

### "Firebase token verification fails"
- Verify `FIREBASE_SERVICE_ACCOUNT_JSON` is valid JSON
- Check Firebase project ID matches frontend config
- Review backend logs for specific error

### ".env file not being picked up"
- Delete `.env` and recreate from `.env.example`
- Restart development servers
- Check file is in correct directory (root for frontend, backend/ for backend)

## .gitignore

Never commit .env files! Ensure `.gitignore` includes:
```
.env
.env.local
.env.*.local
backend/.env
backend/.env.local
```
