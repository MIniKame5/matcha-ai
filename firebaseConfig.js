import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const authConfig = {
  apiKey: process.env.FIREBASE_AUTH_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_AUTH_PROJECT_ID,
  storageBucket: process.env.FIREBASE_AUTH_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_AUTH_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_AUTH_APP_ID,
};
const dbConfig = {
  apiKey: process.env.FIREBASE_DB_API_KEY,
  authDomain: process.env.FIREBASE_DB_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_DB_PROJECT_ID,
  storageBucket: process.env.FIREBASE_DB_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_DB_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_DB_APP_ID,
};

let authApp = null;
let dbApp = null;
let auth = null;
let db = null;

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