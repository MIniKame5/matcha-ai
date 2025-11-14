// Fix: Separated value and type imports to resolve potential module resolution issues.
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// --- Configuration for Authentication Project ---
const authConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_AUTH_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_AUTH_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_AUTH_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_AUTH_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_AUTH_APP_ID,
};

// --- Configuration for Database (Firestore) Project ---
const dbConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_DB_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_DB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_DB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_DB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_DB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_DB_APP_ID,
};

let authApp: FirebaseApp | null = null;
let dbApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const isAuthConfigured = authConfig.apiKey && authConfig.projectId;
const isDbConfigured = dbConfig.apiKey && dbConfig.projectId;

if (isAuthConfigured) {
  try {
    authApp = initializeApp(authConfig, 'authApp');
    auth = getAuth(authApp);
  } catch (error) {
    console.error("Firebase Auth initialization failed:", error);
  }
} else {
  console.warn("Firebase Auth config is missing. Authentication will be disabled.");
}

if (isDbConfigured) {
  try {
    dbApp = initializeApp(dbConfig, 'dbApp');
    db = getFirestore(dbApp);
  } catch (error) {
    console.error("Firebase DB initialization failed:", error);
  }
} else {
  console.warn("Firebase DB config is missing. Chat history will not be saved.");
}

export const isFirebaseConfigured = !!auth && !!db;
export { auth, db };