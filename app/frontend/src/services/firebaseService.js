import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API,
    authDomain: "circular-marketplace-972a4.firebaseapp.com",
    projectId: "circular-marketplace-972a4",
    storageBucket: "circular-marketplace-972a4.firebasestorage.app",
    messagingSenderId: "214975711670",
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-P69LM0MWW3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };