import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from '../firebaseConfig.js';

export const onAuthStateChangedListener = (callback) => {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signUpUser = async (email, password) => {
  if (!isFirebaseConfigured || !auth || !email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email, password) => {
  if (!isFirebaseConfigured || !auth || !email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  if (!isFirebaseConfigured || !auth) return;
  await signOut(auth);
};