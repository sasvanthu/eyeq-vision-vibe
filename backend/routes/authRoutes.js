const express = require('express');
const router = express.Router();
const { admin: firebaseAdmin } = require('../config/firebase');
const User = require('../models/User');

// @desc    Create user in db after client-side registration/login
// @route   POST /api/auth
// @access  Public (expects Firebase ID token)
router.post('/', async (req, res) => {
    let idToken = req.body && req.body.idToken;
    if (!idToken && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        idToken = req.headers.authorization.split('Bearer ')[1];
    }

    if (!idToken) {
        console.error('No ID token provided to auth route');
        return res.status(400).json({ 
            error: 'Bad Request',
            message: 'No authentication token provided' 
        });
    }

    try {
        if (!firebaseAdmin || !firebaseAdmin.apps.length) {
            console.error('Firebase Admin not initialized in auth route');
            return res.status(500).json({ 
                error: 'Service Unavailable',
                message: 'Authentication service not configured' 
            });
        }

        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
        console.log('Token verified for user:', decodedToken.uid);
        const { uid, email, name } = decodedToken;

        let user = await User.findById(uid);

        if (!user) {
            const newUser = {
                uid,
                email,
                name: name || 'User',
                role: 'user',
                bio: '',
                skills: [],
                socialLinks: {},
                stats: {
                    projects: 0,
                    contributions: 0,
                    feedback: 0
                },
                joinedDate: new Date().toISOString()
            };
            
            try {
                user = await User.create(newUser);
                console.log('New user created:', uid);
            } catch (createError) {
                console.error('Error creating new user:', createError.message);
                return res.status(500).json({ 
                    error: 'Internal Server Error',
                    message: 'Failed to create user profile' 
                });
            }
        } else {
            // Optionally update basic profile fields if missing
            const updates = {};
            if (!user.email && email) updates.email = email;
            if (!user.name && name) updates.name = name;
            if (Object.keys(updates).length) {
                try { 
                    await User.update(uid, updates);
                    console.log('User profile updated:', uid);
                } catch (updateError) { 
                    console.warn('Failed updating user basic fields:', updateError.message);
                    // Don't fail the request if update fails - user already exists
                }
            }
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error in auth route:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        // Token verification errors
        if (error.code && error.code.includes('id-token')) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Token verification failed' 
            });
        }

        // Generic error
        return res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message || 'Authentication failed' 
        });
    }
});

module.exports = router;
