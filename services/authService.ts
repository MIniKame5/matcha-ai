import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth, isFirebaseConfigured } from '../firebaseConfig';

type AuthStateChangedCallback = (user: User | null) => void;

export const onAuthStateChangedListener = (callback: AuthStateChangedCallback) => {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const signUpUser = async (email?: string, password?: string) => {
  if (!isFirebaseConfigured || !auth || !email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInUser = async (email?: string, password?: string) => {
  if (!isFirebaseConfigured || !auth || !email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  if (!isFirebaseConfigured || !auth) return;
  await signOut(auth);
};
