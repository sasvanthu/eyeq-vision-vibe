const { admin: firebaseAdmin } = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let idToken;

    // Extract token from Authorization header or request body
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.body && req.body.idToken) {
        idToken = req.body.idToken;
    }

    if (!idToken) {
        console.warn('Unauthorized request - no token provided to:', req.path);
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'No authentication token provided' 
        });
    }

    try {
        if (!firebaseAdmin || !firebaseAdmin.apps.length) {
            console.error('Firebase Admin not initialized when verifying token');
            return res.status(500).json({ 
                error: 'Service Unavailable',
                message: 'Authentication service not configured' 
            });
        }

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error while verifying Firebase ID token:', {
            error: error.message,
            code: error.code,
            path: req.path
        });

        // Provide specific error responses based on token error type
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ 
                error: 'Token Expired',
                message: 'Your authentication token has expired. Please log in again.' 
            });
        } else if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({ 
                error: 'Token Revoked',
                message: 'Your authentication token has been revoked.' 
            });
        } else if (error.code === 'auth/invalid-id-token') {
            return res.status(401).json({ 
                error: 'Invalid Token',
                message: 'The authentication token is invalid.' 
            });
        } else {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Token verification failed' 
            });
        }
    }
};

const admin = async (req, res, next) => {
    try {
        if (!req.user || !req.user.uid) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'User information not found' 
            });
        }

        const user = await User.findById(req.user.uid);
        if (user && user.role === 'admin') {
            next();
        } else {
            console.warn('Access denied - user is not an admin:', req.user.uid);
            return res.status(403).json({ 
                error: 'Forbidden',
                message: 'Admin privileges required' 
            });
        }
    } catch (error) {
        console.error('Error checking admin status:', error.message);
        return res.status(500).json({ 
            error: 'Internal Server Error',
            message: 'Failed to verify admin status' 
        });
    }
};

module.exports = { protect, admin };
