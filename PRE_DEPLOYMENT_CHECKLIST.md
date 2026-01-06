# 🚀 Pre-Deployment Checklist

Use this checklist to ensure everything is ready for production deployment.

---

## ✅ Code Changes

- [x] Backend server.js updated with CORS, health check, error handling
- [x] Auth middleware enhanced with detailed error responses
- [x] Auth routes improved with better logging
- [x] Frontend axios config uses environment variables
- [x] Firebase config uses environment variables
- [x] Vite config updated for env variables
- [x] Image paths fixed (Vice President.jpg)
- [x] Admin route fixed (vercel.json rewrites)
- [x] No hardcoded localhost URLs in code

---

## 🔐 Security Setup

### Backend (Render)

- [ ] `NODE_ENV=production` set
- [ ] `PORT=5000` set
- [ ] `CORS_ORIGIN=https://eyeq-simats.vercel.app` set
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` set (full JSON)
- [ ] `SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_KEY` set (not exposed in any file)

**Where to set**: Render Dashboard → Your Service → Settings → Environment

### Frontend (Vercel)

- [ ] `VITE_API_BASE_URL=https://eyeq-backend-lodl.onrender.com/api` set
- [ ] `VITE_FIREBASE_API_KEY` set
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` set
- [ ] `VITE_FIREBASE_PROJECT_ID` set
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` set
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` set
- [ ] `VITE_FIREBASE_APP_ID` set
- [ ] `VITE_FIREBASE_MEASUREMENT_ID` set

**Where to set**: Vercel Dashboard → Your Project → Settings → Environment Variables

---

## 🔗 Integration Verification

### Backend Connectivity

- [ ] Firebase Admin SDK initializes (check Render logs)
- [ ] Supabase client initializes (check Render logs)
- [ ] Database migration status verified
- [ ] Service account credentials valid

### Frontend Configuration

- [ ] Firebase SDK initializes
- [ ] Axios client creates with correct base URL
- [ ] No console errors about missing env variables

### Cross-Origin Communication

- [ ] Frontend can make requests to backend
- [ ] CORS headers present in responses
- [ ] Tokens attach to requests automatically

---

## 🧪 Testing

### Backend Health

```bash
# 1. Health check endpoint
curl https://eyeq-backend-lodl.onrender.com/
# Expected: { "message": "EyeQ Backend is running 🚀", ... }

# 2. Check logs
# Open Render dashboard → Logs tab
# Verify no errors during startup
```

### Frontend Functionality

- [ ] App loads at https://eyeq-simats.vercel.app
- [ ] Home page displays correctly
- [ ] Team member images load (no 404s)
- [ ] Admin panel route `/eyeqcontrol2k25` accessible
- [ ] No console errors (F12 → Console tab)

### Authentication

- [ ] Firebase login screen appears
- [ ] Can sign up with email
- [ ] Can sign in with existing account
- [ ] Token auto-attaches to API requests
- [ ] Logout works

### API Communication

Open DevTools (F12) → Network tab:
- [ ] API requests go to `https://eyeq-backend-lodl.onrender.com/api`
- [ ] NO localhost requests
- [ ] Authorization header includes Bearer token
- [ ] Responses have correct status codes

### Admin Panel

- [ ] Accessible at `/eyeqcontrol2k25`
- [ ] Shows admin statistics
- [ ] Can view members list
- [ ] Can view contributions
- [ ] Can view activity log

---

## 🐛 Error Scenarios

### Expect These Errors (Normal)

- [ ] 401 on `/api/auth` without token (by design)
- [ ] 403 on `/api/admin/*` for non-admin users (by design)
- [ ] CORS error from non-whitelisted origins (by design)

### Should NOT See These Errors

- [ ] 404 on team member images (fixed)
- [ ] 404 on admin route `/eyeqcontrol2k25` (fixed)
- [ ] API going to localhost (fixed)
- [ ] CORS error from Vercel frontend (fixed)
- [ ] Missing env variable warnings (fixed)

---

## 📊 Production Monitoring

### Render Logs

- [ ] Check logs daily for errors
- [ ] No "Firebase Admin not initialized" messages
- [ ] No "Supabase credentials missing" messages
- [ ] Token validation working (no auth errors)

### Vercel Analytics

- [ ] Frontend loads successfully
- [ ] Build succeeds without warnings
- [ ] No unhandled promise rejections

### Browser Console (Production)

- [ ] No console errors
- [ ] No missing resource warnings
- [ ] Firebase SDK loaded
- [ ] Axios configured correctly

---

## 📱 User Testing

### Registration Flow

- [ ] User can sign up with email
- [ ] Verification email sent
- [ ] Can verify and log in
- [ ] Profile created in database

### Login Flow

- [ ] User can log in with email
- [ ] Redirect to dashboard
- [ ] User profile loads
- [ ] Stats display correctly

### API Requests

- [ ] Dashboard data loads
- [ ] Can create/view projects
- [ ] Can submit contributions
- [ ] Can view feedback
- [ ] Announcements display

### Admin Functions

- [ ] Can access admin panel
- [ ] Stats show accurate numbers
- [ ] Can view all members
- [ ] Can manage content

---

## 🚨 Rollback Plan

If something goes wrong:

1. **Backend Issue**: Roll back Render to previous commit
2. **Frontend Issue**: Roll back Vercel to previous deployment
3. **Database Issue**: Contact Supabase support with error details
4. **Auth Issue**: Check Firebase console for account status

**Rollback Steps**:
```bash
# Render: Select previous deployment and click "Redeploy"
# Vercel: Select previous deployment and click "Rollback"
```

---

## 📋 Final Checklist Before Going Live

- [ ] All environment variables set correctly
- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] Firebase authentication works
- [ ] API communication works
- [ ] Admin panel accessible
- [ ] No 404 errors on resources
- [ ] CORS working correctly
- [ ] Error messages meaningful
- [ ] Logs show no critical errors
- [ ] Browser console clean
- [ ] All team member images display
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads user data
- [ ] Admin functions work

---

## 🎯 Post-Deployment Monitoring

**Day 1**:
- [ ] Monitor Render logs hourly
- [ ] Test main workflows
- [ ] Check Vercel deployment metrics
- [ ] Ask 2-3 users to test

**Week 1**:
- [ ] Daily check of error logs
- [ ] Monitor API response times
- [ ] Review user feedback
- [ ] Check for auth issues

**Ongoing**:
- [ ] Weekly log review
- [ ] Monitor error rates
- [ ] Track performance metrics
- [ ] Update docs with lessons learned

---

## 📞 Emergency Contacts

If critical issue occurs:
1. Check Render logs for errors
2. Check Vercel deployment status
3. Verify Firebase console for service status
4. Check Supabase console for database status
5. Review recent code changes

---

## ✨ Celebration 🎉

Once all checks pass:

```
✅ Code is production-ready
✅ Security is configured
✅ Monitoring is in place
✅ Team is trained on processes
✅ Documentation is complete

🚀 Ready to Deploy!
```

---

**Checked By**: ___________________
**Date**: ___________________
**Status**: ___________________

---

**Questions?** See:
- [PRODUCTION_DEPLOYMENT_GUIDE.md](PRODUCTION_DEPLOYMENT_GUIDE.md)
- [ENV_SETUP.md](ENV_SETUP.md)
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
