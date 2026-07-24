import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// DVS Pest Infra — Firebase Project: dvspest-infra (Project Number: 373368655490)
const firebaseConfig = {
  apiKey: "AIzaSyD3bRL8SnJ59Qhf4xFZtYu6nOmUNnGgaBc",
  authDomain: "dvspest-infra.firebaseapp.com",
  projectId: "dvspest-infra",
  storageBucket: "dvspest-infra.firebasestorage.app",
  messagingSenderId: "373368655490",
  appId: "1:373368655490:web:52aa3c13e9e1823a7c2e9b",
  measurementId: "G-G3NK3HVW0W"
};

// Initialize Firebase App (guard against duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { RecaptchaVerifier };
export default app;
