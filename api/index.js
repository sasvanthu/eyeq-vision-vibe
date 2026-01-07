const path = require('path');
const fs = require('fs');

// Load environment variables from .env files
const envPath = path.resolve(__dirname, '..', '.env');
const envLocalPath = path.resolve(__dirname, '..', '.env.local');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
}
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Ensure environment variables are set
process.env.VITE_API_BASE_URL = '/api';
process.env.NODE_ENV = 'production';

const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin
try {
  require('../backend/config/firebase');
} catch (e) {
  console.warn('Firebase initialization warning:', e.message);
}

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://eyeq-simats.vercel.app',
  'https://eyeq-vision-vibe.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'EyeQ Backend API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: 'vercel-production',
    version: '1.0.0'
  });
});

// Health Check Routes
try {
  app.use('/health', require('../backend/routes/healthRoutes'));
} catch (e) {
  console.warn('Health routes warning:', e.message);
}

// API Routes
const apiRoutes = [
  { path: '/users', route: '../backend/routes/userRoutes' },
  { path: '/auth', route: '../backend/routes/authRoutes' },
  { path: '/projects', route: '../backend/routes/projectRoutes' },
  { path: '/contributions', route: '../backend/routes/contributionRoutes' },
  { path: '/feedback', route: '../backend/routes/feedbackRoutes' },
  { path: '/admin', route: '../backend/routes/adminRoutes' },
  { path: '/announcements', route: '../backend/routes/announcementRoutes' },
  { path: '/achievements', route: '../backend/routes/achievementRoutes' },
];

apiRoutes.forEach(({ path: routePath, route: routeFile }) => {
  try {
    app.use(routePath, require(routeFile));
  } catch (e) {
    console.warn(`Warning: Could not load ${routePath}:`, e.message);
  }
});

// Debug endpoint
app.get('/debug', async (req, res) => {
  try {
    const supabase = require('../backend/config/supabase');
    const { admin: firebaseAdmin } = require('../backend/config/firebase');

    const fbInitialized = firebaseAdmin && firebaseAdmin.apps && firebaseAdmin.apps.length > 0;
    let supabaseOk = false;
    let supabaseMsg = null;

    try {
      if (supabase && supabase.from) {
        const { data, error } = await supabase.from('users').select('uid').limit(1);
        if (error) supabaseMsg = error.message || JSON.stringify(error);
        else supabaseOk = true;
      } else {
        supabaseMsg = 'Supabase client not available';
      }
    } catch (e) {
      supabaseMsg = e.message;
    }

    res.json({
      firebaseAdmin: fbInitialized,
      supabaseOk,
      supabaseMsg,
      env: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
        JWT_SECRET: !!process.env.JWT_SECRET
      },
      memory: process.memoryUsage(),
      uptime: process.uptime()
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    status: err.status || 500
  });
});

// Export for Vercel
module.exports = app;
