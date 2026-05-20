import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Initialize anonymous auth
export function initializeAuth() {
  try {
    if (auth.currentUser) {
      return auth.currentUser;
    }

    signInAnonymously(auth).then(() => {
      console.log('Anonymous auth initialized');
    }).catch(error => {
      console.error('Auth initialization failed:', error);
    });

    return auth.currentUser;
  } catch (error) {
    console.error('Auth initialization failed:', error);
    return null;
  }
}
