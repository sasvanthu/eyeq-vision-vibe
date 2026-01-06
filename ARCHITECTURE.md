# Architecture & Data Flow Diagram

## Complete Production Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EYEQ VISION VIBE - PRODUCTION                       │
│                           Secure Data Flow Diagram                           │
└─────────────────────────────────────────────────────────────────────────────┘

                              🌐 INTERNET
                                  ↑↓
                    ┌─────────────────────────┐
                    │  USER BROWSER           │
                    │  (Any Device)           │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ VERCEL FRONTEND         │
                    │ eyeq-simats.vercel.app  │
                    │                         │
                    │ • React + TypeScript    │
                    │ • Vite Build Tool       │
                    │ • Firebase Auth SDK     │
                    │ • Axios HTTP Client     │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │    CLIENT-SIDE OPERATIONS               │
                    │ ✅ Firebase.signUp()                   │
                    │ ✅ Firebase.signIn()                   │
                    │ ✅ Get ID Token                         │
                    │ ✅ Store in localStorage                │
                    └────────────┬────────────────────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │  API REQUEST WITH TOKEN                 │
                    │ Headers: {                              │
                    │   Authorization: "Bearer {TOKEN}",      │
                    │   Content-Type: "application/json"      │
                    │ }                                       │
                    └────────────┬────────────────────────────┘
                                 ↓ HTTPS
                    ┌─────────────────────────┐
                    │ RENDER BACKEND          │
                    │ eyeq-backend-lodl.onr   │
                    │                         │
                    │ • Node.js + Express     │
                    │ • CORS Protection       │
                    │ • Firebase Admin SDK    │
                    │ • Supabase Client       │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │  BACKEND SECURITY CHECKS                │
                    │ ✅ Extract Bearer token from header    │
                    │ ✅ Verify with Firebase Admin SDK       │
                    │ ✅ Check token expiration               │
                    │ ✅ Extract user UID from token          │
                    │ ✅ Check user role (for admin routes)   │
                    └────────────┬────────────────────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │  REQUEST PROCESSING                     │
                    │ • Validate request data                 │
                    │ • Apply business logic                  │
                    │ • Prepare database query                │
                    └────────────┬────────────────────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │ SUPABASE DATABASE                       │
                    │ • PostgreSQL (ACID compliant)           │
                    │ • Row Level Security (RLS)              │
                    │ • Service Role Key (backend only)       │
                    │                                         │
                    │ Tables:                                 │
                    │ • users (user profiles)                 │
                    │ • projects (community projects)         │
                    │ • contributions (member work)           │
                    │ • feedback (user feedback)              │
                    │ • announcements (club news)             │
                    │ • achievements (awards)                 │
                    └────────────┬────────────────────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │  DATABASE RESPONSE                      │
                    │ {                                       │
                    │   "uid": "user123",                     │
                    │   "email": "user@example.com",          │
                    │   "name": "User Name",                  │
                    │   "role": "user",                       │
                    │   "stats": { ... }                      │
                    │ }                                       │
                    └────────────┬────────────────────────────┘
                                 ↓ HTTPS
                    ┌─────────────────────────────────────────┐
                    │  BACKEND RESPONSE                       │
                    │ Status: 200 OK                          │
                    │ CORS Headers: Access-Control-Allow-*   │
                    │ Body: User data + profile information   │
                    └────────────┬────────────────────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │  FRONTEND RECEIVES DATA                 │
                    │ • Response interceptor processes it     │
                    │ • Error handling if needed              │
                    │ • Store in React Context                │
                    │ • Update UI with user data              │
                    └────────────┬────────────────────────────┘
                                 ↓
                    ┌─────────────────────────────────────────┐
                    │  USER SEES PERSONALIZED CONTENT         │
                    │ ✅ Dashboard with stats                │
                    │ ✅ Project list                        │
                    │ ✅ Contribution history                │
                    │ ✅ Admin panel (if admin role)         │
                    └─────────────────────────────────────────┘
```

---

## Environment Variables Mapping

```
┌───────────────────────────────────────────────────────────────────────┐
│                     ENVIRONMENT VARIABLES                             │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  VERCEL FRONTEND (Public)                                           │
│  ├─ VITE_API_BASE_URL                                              │
│  │  └─ Points to: https://eyeq-backend-lodl.onrender.com/api       │
│  │                                                                 │
│  └─ VITE_FIREBASE_* (Public keys - safe to expose)                │
│     ├─ VITE_FIREBASE_API_KEY                                      │
│     ├─ VITE_FIREBASE_AUTH_DOMAIN                                  │
│     ├─ VITE_FIREBASE_PROJECT_ID                                   │
│     ├─ VITE_FIREBASE_STORAGE_BUCKET                               │
│     ├─ VITE_FIREBASE_MESSAGING_SENDER_ID                          │
│     ├─ VITE_FIREBASE_APP_ID                                       │
│     └─ VITE_FIREBASE_MEASUREMENT_ID                               │
│                                                                    │
│  RENDER BACKEND (Private/Secure)                                   │
│  ├─ NODE_ENV=production                                            │
│  ├─ PORT=5000                                                      │
│  ├─ CORS_ORIGIN=https://eyeq-simats.vercel.app                   │
│  │  └─ Only this origin can call our API                          │
│  │                                                                 │
│  ├─ FIREBASE_SERVICE_ACCOUNT_JSON (BACKEND ONLY)                  │
│  │  ├─ Full service account key                                   │
│  │  ├─ Enables admin operations                                   │
│  │  └─ ⚠️ NEVER expose to frontend                                │
│  │                                                                 │
│  ├─ SUPABASE_URL                                                   │
│  │  └─ Database endpoint                                          │
│  │                                                                 │
│  └─ SUPABASE_SERVICE_KEY (BACKEND ONLY)                          │
│     ├─ Full admin access to database                              │
│     └─ ⚠️ NEVER expose to frontend                                │
│                                                                    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Request Flow - Detailed

### 1️⃣ Authentication Request
```
Browser (Vercel)
    ↓
    POST /api/auth
    Headers: {
        Authorization: Bearer eyJhbGc...
        Content-Type: application/json
    }
    ↓
Render Backend
    ↓
authMiddleware.js
    ├─ Extract token from header
    ├─ Verify with Firebase Admin SDK
    ├─ Get user UID from token
    └─ Attach user to req.user
    ↓
authRoutes.js
    ├─ Look up user in Supabase
    ├─ Create if new user
    ├─ Return user profile
    ↓
Response (200 OK)
{
    uid: "user123",
    email: "user@example.com",
    name: "User Name",
    role: "user"
}
    ↓
Browser stores in Context
    ↓
Subsequent requests auto-attach token
```

### 2️⃣ Protected API Request
```
Browser (has token in context)
    ↓
    GET /api/projects
    Headers: {
        Authorization: Bearer {stored_token}
    }
    ↓
Render Backend
    ↓
protect middleware
    ├─ Extract token
    ├─ Verify with Firebase
    └─ Attach to req.user
    ↓
projectRoutes.js
    ├─ Query Supabase with service key
    ├─ Filter results
    └─ Return to user
    ↓
Response (200 OK)
[{projectData}, {projectData}, ...]
    ↓
Browser updates UI
```

### 3️⃣ Admin Request
```
Browser (admin user, has token)
    ↓
    GET /api/admin/stats
    Headers: {
        Authorization: Bearer {admin_token}
    }
    ↓
Render Backend
    ↓
protect middleware → admin middleware
    ├─ Verify token
    ├─ Check role === "admin"
    ├─ 403 if not admin
    └─ Proceed if admin
    ↓
adminRoutes.js
    ├─ Query sensitive data
    ├─ Calculate statistics
    └─ Return admin stats
    ↓
Response (200 OK)
{
    totalMembers: 50,
    activeProjects: 12,
    totalContributions: 234
}
    ↓
Admin panel displays dashboard
```

---

## Error Handling Flow

```
Request comes in
    ↓
Multiple possible outcomes:
    
    ✅ Success (200 OK)
    ├─ Request processed
    └─ Valid response returned
    
    ❌ Bad Request (400)
    ├─ Cause: Missing/invalid data
    ├─ Example: No token provided
    └─ Response: {error, message}
    
    ❌ Unauthorized (401)
    ├─ Cause: Token missing or invalid
    ├─ Examples:
    │  ├─ Token expired
    │  ├─ Token revoked
    │  └─ Token corrupted
    └─ Response: {error, message}
    
    ❌ Forbidden (403)
    ├─ Cause: User authenticated but no permission
    ├─ Example: Non-admin accessing /api/admin
    └─ Response: {error, message}
    
    ❌ Not Found (404)
    ├─ Cause: Route or resource doesn't exist
    └─ Response: {error, message}
    
    ❌ Server Error (500)
    ├─ Cause: Backend error
    ├─ Examples:
    │  ├─ Firebase not initialized
    │  ├─ Database connection failed
    │  └─ Unexpected exception
    └─ Response: {error, message}
```

---

## CORS Security

```
┌─────────────────────────────────────────────────────────────────┐
│                    CORS WHITELIST                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ ALLOWED Origins (Can call our API)                         │
│  ├─ https://eyeq-simats.vercel.app     (Production Frontend)  │
│  ├─ http://localhost:3000              (Local Dev 1)          │
│  ├─ http://localhost:5173              (Vite Dev)            │
│  └─ http://localhost:8080              (Vite Alt)            │
│                                                                 │
│  ❌ BLOCKED Origins (Cannot call our API)                     │
│  ├─ http://attacker.com                (Different origin)    │
│  ├─ https://phishing-site.com          (Phishing)            │
│  ├─ http://localhost:3001              (Different port)      │
│  └─ Any other unknown origin                                 │
│                                                                 │
│  ℹ️  How it works:                                             │
│  1. Browser makes cross-origin request                         │
│  2. Sends Origin header                                        │
│  3. Backend checks if origin is in whitelist                   │
│  4. If yes: Send CORS headers, allow request                   │
│  5. If no: Reject request, return error                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT PLATFORMS                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  VERCEL (Frontend)                                              │
│  ├─ Auto-deploys from git pushes                               │
│  ├─ Stores environment variables securely                      │
│  ├─ Serves React app over HTTPS/CDN                           │
│  ├─ Auto-scaling for traffic spikes                           │
│  └─ URL: https://eyeq-simats.vercel.app                       │
│                                                                 │
│  RENDER (Backend)                                              │
│  ├─ Auto-deploys from git pushes                               │
│  ├─ Stores environment variables securely                      │
│  ├─ Runs Node.js server                                        │
│  ├─ Auto-scaling for API load                                 │
│  └─ URL: https://eyeq-backend-lodl.onrender.com               │
│                                                                 │
│  SUPABASE (Database)                                           │
│  ├─ PostgreSQL database                                        │
│  ├─ Automatic backups                                          │
│  ├─ Row Level Security enabled                                │
│  ├─ REST API endpoint                                          │
│  └─ Service role key stored in Render env                     │
│                                                                 │
│  FIREBASE (Authentication)                                     │
│  ├─ Handles user signup/signin                                │
│  ├─ Manages JWT tokens                                        │
│  ├─ Service account in Render                                 │
│  ├─ Public key in Vercel                                      │
│  └─ Free tier available                                       │
│                                                                 │
└───────────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌───────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                                │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Layer 1: HTTPS/TLS Encryption                                  │
│  ├─ All traffic encrypted in transit                            │
│  └─ Protects against man-in-the-middle attacks                 │
│                                                                   │
│  Layer 2: CORS Protection                                       │
│  ├─ Only whitelisted origins can call API                       │
│  └─ Prevents unauthorized cross-site requests                   │
│                                                                   │
│  Layer 3: Firebase Authentication                               │
│  ├─ Users must authenticate to get token                        │
│  ├─ Tokens include user identity and expiration                │
│  └─ Backend verifies token signature                            │
│                                                                   │
│  Layer 4: Token Verification                                    │
│  ├─ Backend validates Firebase signature                        │
│  ├─ Checks token expiration                                    │
│  └─ Rejects invalid/expired tokens                             │
│                                                                   │
│  Layer 5: Role-Based Access Control                             │
│  ├─ User role checked for admin routes                          │
│  ├─ Non-admins get 403 Forbidden                               │
│  └─ Prevents privilege escalation                               │
│                                                                   │
│  Layer 6: Service Key Segregation                               │
│  ├─ Service key backend-only                                   │
│  ├─ Frontend never sees database keys                           │
│  └─ Database queries mediated through backend                   │
│                                                                   │
│  Layer 7: Row Level Security                                    │
│  ├─ Database enforces row-level access                          │
│  ├─ Users can only access own data                             │
│  └─ Backup protection layer                                    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## Summary

✅ **Secure Architecture**
✅ **Clear Data Flow**
✅ **Multiple Security Layers**
✅ **Environment Variable Separation**
✅ **Role-Based Access Control**
✅ **Error Handling**
✅ **Production Ready**

---

**This architecture ensures**:
1. User data is secure
2. Only authenticated users can access APIs
3. Only authorized users can access admin functions
4. Database credentials never exposed
5. Frontend/backend properly separated
6. CORS protects against unauthorized access
7. All communication encrypted
8. Meaningful error responses

🔒 **Production-Grade Security Implemented**
