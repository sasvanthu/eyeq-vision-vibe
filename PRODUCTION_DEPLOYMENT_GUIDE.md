# Production Deployment Guide

## Overview
This guide covers deploying EyeQ Vision Vibe to production:
- **Frontend**: Vercel (https://eyeq-simats.vercel.app)
- **Backend**: Render (https://eyeq-backend-lodl.onrender.com)
- **Database**: Supabase
- **Auth**: Firebase

---

## Part 1: Backend Deployment (Render)

### 1.1 Prerequisites
- Render account with active web service
- Firebase project with service account credentials
- Supabase project with API keys

### 1.2 Environment Variables (Set in Render Dashboard)

Go to your Render service → Environment → Add the following:

```
NODE_ENV=production
PORT=5000

CORS_ORIGIN=https://eyeq-simats.vercel.app

FIREBASE_SERVICE_ACCOUNT_JSON=<your-firebase-service-account-json>
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_KEY=<your-supabase-service-key>
```

### 1.3 Backend Configuration Details

**CORS Setup:**
- Only allows requests from `https://eyeq-simats.vercel.app`
- Rejects requests from localhost or other origins
- Credentials enabled for cross-origin requests

**API Routes:**
- All routes prefixed with `/api`
- Example: `/api/auth`, `/api/users`, `/api/projects`

**Firebase Authentication:**
- Validates all requests with Firebase ID token
- Tokens verified using Firebase Admin SDK (backend only)
- Service role key NEVER exposed to frontend

**Health Check:**
- Route: `GET /` 
- Response: `{ message: "EyeQ Backend is running 🚀", ... }`
- Use this to verify deployment

### 1.4 Verify Deployment

Test the health endpoint:
```bash
curl https://eyeq-backend-lodl.onrender.com/
```

Expected response:
```json
{
  "message": "EyeQ Backend is running 🚀",
  "timestamp": "2025-01-04T...",
  "environment": "production"
}
```

Test authentication endpoint:
```bash
curl -X POST https://eyeq-backend-lodl.onrender.com/api/auth \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <FIREBASE_ID_TOKEN>" 
```

---

## Part 2: Frontend Deployment (Vercel)

### 2.1 Environment Variables (Set in Vercel Dashboard)

Go to your Vercel project → Settings → Environment Variables:

```
VITE_API_BASE_URL=https://eyeq-backend-lodl.onrender.com/api

VITE_FIREBASE_API_KEY=AIzaSyCp0PdBk9mEa_0kVQXQi_dVx5Aq5QqIVwY
VITE_FIREBASE_AUTH_DOMAIN=eyeq-web.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eyeq-web
VITE_FIREBASE_STORAGE_BUCKET=eyeq-web.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=462274604850
VITE_FIREBASE_APP_ID=1:462274604850:web:6bcbfbaf2bb7976ba9712b
VITE_FIREBASE_MEASUREMENT_ID=G-KKPSG916YR
```

### 2.2 Frontend Configuration Details

**API Configuration:**
- All API calls use `VITE_API_BASE_URL` from environment
- Fallback to `https://eyeq-backend-lodl.onrender.com/api` in production
- Fallback to `http://localhost:5000/api` in development

**Firebase Configuration:**
- All credentials loaded from environment variables
- API key is public (client-side safe)
- Service account credentials NEVER used in frontend

**Request Interceptors:**
- Automatically attach Firebase ID token to all requests
- Better error handling with meaningful messages
- Token refresh handled by Firebase SDK

### 2.3 Verify Deployment

1. Open https://eyeq-simats.vercel.app in browser
2. Test login/signup with Firebase
3. Check Network tab → verify API calls go to `https://eyeq-backend-lodl.onrender.com/api`
4. Check Console → verify no localhost URLs

---

## Part 3: Production Checklist

### Security
- [ ] CORS configured correctly (backend)
- [ ] Only production origin allowed (backend)
- [ ] Firebase ID tokens validated on backend
- [ ] Supabase service key only on backend
- [ ] No hardcoded keys in frontend code
- [ ] Environment variables used for all secrets

### Data Flow
- [ ] Frontend → Firebase auth works
- [ ] Frontend → Backend API calls work
- [ ] Backend → Firebase verification works
- [ ] Backend → Supabase queries work
- [ ] Token expiration handled correctly

### Monitoring
- [ ] Backend health endpoint responds
- [ ] Error messages are meaningful
- [ ] Render logs show no auth errors
- [ ] Vercel build logs show no env var warnings

### API Endpoints
- [ ] GET `/` → health check
- [ ] POST `/api/auth` → user authentication
- [ ] GET `/api/users/:id` → user profile
- [ ] GET `/api/admin/*` → admin routes (protected)
- [ ] All routes reject invalid tokens

---

## Part 4: Troubleshooting

### 404 errors on static files
- **Cause**: Image paths with spaces
- **Fix**: Use URL-encoded paths (e.g., `Vice%20President.jpg`)
- **Status**: ✅ Fixed

### CORS errors
- **Cause**: Frontend origin not in backend CORS whitelist
- **Fix**: Check Render environment variable `CORS_ORIGIN`
- **Expected**: Only `https://eyeq-simats.vercel.app` allowed

### 401 Unauthorized errors
- **Cause**: Invalid or missing Firebase ID token
- **Fix**: Ensure Firebase SDK initialized in frontend
- **Debug**: Check Network tab → Authorization header present?

### 500 Internal Server Error
- **Cause**: Firebase Admin SDK not initialized or Supabase connection failed
- **Fix**: Verify environment variables in Render dashboard
- **Debug**: Check Render logs for specific error message

### API calls to localhost
- **Cause**: Hardcoded localhost URL in code
- **Status**: ✅ Fixed (now uses VITE_API_BASE_URL)

---

## Part 5: Local Development Setup

### .env file (frontend)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSyCp0PdBk9mEa_0kVQXQi_dVx5Aq5QqIVwY
VITE_FIREBASE_AUTH_DOMAIN=eyeq-web.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eyeq-web
VITE_FIREBASE_STORAGE_BUCKET=eyeq-web.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=462274604850
VITE_FIREBASE_APP_ID=1:462274604850:web:6bcbfbaf2bb7976ba9712b
VITE_FIREBASE_MEASUREMENT_ID=G-KKPSG916YR
```

### .env file (backend)
```
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_JSON=<paste-entire-json>
SUPABASE_URL=<your-url>
SUPABASE_SERVICE_KEY=<your-key>
```

### Run locally
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
npm install
npm run dev
```

---

## Part 6: Environment Variables Reference

### Backend (Render) - All Required

| Variable | Type | Required | Example |
|----------|------|----------|---------|
| NODE_ENV | string | ✅ | `production` |
| PORT | number | ✅ | `5000` |
| CORS_ORIGIN | URL | ✅ | `https://eyeq-simats.vercel.app` |
| FIREBASE_SERVICE_ACCOUNT_JSON | JSON string | ✅ | `{...}` |
| SUPABASE_URL | URL | ✅ | `https://xxx.supabase.co` |
| SUPABASE_SERVICE_KEY | string | ✅ | `eyJhbGc...` |

### Frontend (Vercel) - All Public

| Variable | Type | Required | Note |
|----------|------|----------|------|
| VITE_API_BASE_URL | URL | ✅ | Production backend URL |
| VITE_FIREBASE_API_KEY | string | ✅ | Public key (safe to expose) |
| VITE_FIREBASE_AUTH_DOMAIN | domain | ✅ | Firebase domain |
| VITE_FIREBASE_PROJECT_ID | string | ✅ | Firebase project ID |
| VITE_FIREBASE_STORAGE_BUCKET | bucket | ✅ | Firebase storage |
| VITE_FIREBASE_MESSAGING_SENDER_ID | string | ✅ | Firebase messaging ID |
| VITE_FIREBASE_APP_ID | string | ✅ | Firebase app ID |
| VITE_FIREBASE_MEASUREMENT_ID | string | ⚠️ | Optional, for analytics |

---

## Summary

✅ **Completed Fixes**:
1. Backend health check route added
2. CORS configured for production
3. Firebase authentication middleware enhanced
4. API routes properly prefixed with `/api`
5. Environment variables configured for frontend/backend
6. Error handling improved
7. No localhost URLs in production code
8. Static file paths fixed (image 404s)

✅ **Production Ready**:
- Frontend → Backend communication secure
- Authentication flow verified
- Error messages meaningful
- Deployment URLs correct
