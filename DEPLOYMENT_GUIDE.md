# Deployment Guide: Render (Backend) + Vercel (Frontend)

## Overview
This guide walks you through deploying your EyeQ Vision Vibe application with:
- **Backend**: Node.js Express server on Render
- **Frontend**: React + Vite on Vercel

---

## Part 1: Backend Deployment on Render

### Prerequisites
- GitHub account with your repository pushed
- Render account (free tier available)

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 2: Create a Web Service
1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. Configure the following:
   - **Name**: `eyeq-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon` (free tier)
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (or upgrade as needed)

### Step 3: Add Environment Variables
In Render dashboard, go to **Environment** and add:

```
NODE_ENV=production
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=10000
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

**Important**: Get these values from:
- Firebase: Google Cloud Console
- Supabase: Supabase dashboard

### Step 4: Update Backend CORS
Edit `backend/server.js` to allow Vercel domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait for build to complete (3-5 minutes)
3. Copy your Render URL (e.g., `https://eyeq-backend.onrender.com`)

---

## Part 2: Frontend Deployment on Vercel

### Prerequisites
- Render backend URL (from Part 1)
- Vercel account (free tier available)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### Step 2: Create Environment Variables File
Create `.env.production` in your root directory:

```env
VITE_API_BASE_URL=https://eyeq-backend.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Update API Configuration
Edit `src/api/axios.ts`:

```typescript
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Step 4: Import Project to Vercel
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Vercel should auto-detect settings (Vite)

### Step 5: Configure Build & Environment
In Vercel Project Settings:

**Build Settings**:
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables**:
Add all variables from `.env.production`

### Step 6: Deploy
1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Get your Vercel URL (e.g., `https://eyeq-vision-vibe.vercel.app`)

---

## Part 3: Post-Deployment Configuration

### Step 1: Update Backend CORS Origin
Go back to Render dashboard and update:
```
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

### Step 2: Test API Connection
In your browser console:
```javascript
fetch('https://eyeq-backend.onrender.com/users')
  .then(res => res.json())
  .then(data => console.log(data))
```

### Step 3: Update Project URLs
Update any hardcoded URLs in your code:
- Contact forms
- Social media links
- API endpoints

### Step 4: Test All Features
- Authentication flow
- API calls
- File uploads (Cloudinary)
- Database operations

---

## Troubleshooting

### Backend won't start
- Check Render logs: **Logs** tab
- Verify all environment variables are set
- Ensure `backend/package.json` has correct `start` script

### Frontend shows CORS errors
- Verify `CORS_ORIGIN` in Render matches Vercel URL
- Check browser DevTools → Network tab for actual error
- Ensure backend server is running

### Build fails on Vercel
- Check build logs
- Ensure all dependencies in `package.json`
- Check for TypeScript errors: `npm run build` locally

### Images not loading
- Check if using absolute paths
- Update image paths to use environment variables
- Verify public folder is deployed

---

## Monitoring & Logs

**Render Logs**:
- Dashboard → Your service → **Logs** tab
- Real-time server logs

**Vercel Logs**:
- Project dashboard → **Deployments** tab
- Click build to see logs
- View runtime logs in **Edge Network** tab

---

## Quick Reference

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Backend API | Render | `https://eyeq-backend.onrender.com` | [Check] |
| Frontend | Vercel | `https://eyeq-vision-vibe.vercel.app` | [Check] |

---

## Next Steps
1. Add custom domain (optional)
2. Set up GitHub auto-deploy
3. Configure CDN for images
4. Set up monitoring & alerts
5. Implement CI/CD pipeline

For questions, contact your development team.
