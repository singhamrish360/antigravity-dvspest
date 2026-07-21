import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Web App Configuration referencing Project Number 373368655490
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyAsPlaceholderKeyForDVSPEST373368655490",
  authDomain: `dvs-pest-control-373368655490.firebaseapp.com`,
  projectId: `dvs-pest-control-373368655490`,
  storageBucket: `dvs-pest-control-373368655490.appspot.com`,
  messagingSenderId: "373368655490",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:373368655490:web:9f8d7c6b5a4d3c2b1a0f9e"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { RecaptchaVerifier };
export default app;
