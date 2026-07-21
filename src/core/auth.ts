import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithPhoneNumber,
  onAuthStateChanged,
  User,
  ConfirmationResult
} from 'firebase/auth';
import { auth, googleProvider, RecaptchaVerifier } from './firebase';

export interface PhoneAuthSession {
  confirmationResult: ConfirmationResult | null;
}

// 1. Email/Password Authentication
export const emailSignUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const emailSignIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const emailSignOut = () => {
  return firebaseSignOut(auth);
};

export const emailResetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// 2. Google Authentication Provider
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// 3. Phone Number Verification Authentication
// Sets up standard Invisible Recaptcha in the provided DOM element ID
export const setupPhoneRecaptcha = (containerId: string): RecaptchaVerifier => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed to send SMS code
    }
  });
};

export const signInWithPhone = (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

// 4. Auth State Subscription Listener
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
