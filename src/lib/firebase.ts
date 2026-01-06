import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCp0PdBk9mEa_0kVQXQi_dVx5Aq5QqIVwY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eyeq-web.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eyeq-web",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eyeq-web.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "462274604850",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:462274604850:web:6bcbfbaf2bb7976ba9712b",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-KKPSG916YR"
};

// Validate Firebase config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn('Warning: Firebase configuration incomplete. Using fallback values.');
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
