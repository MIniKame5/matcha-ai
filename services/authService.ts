import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebaseConfig';

export const onAuthStateChangedListener = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {}; // No-op unsubscribe function
  }
  return onAuthStateChanged(auth, callback);
}

export const signUpUser = async (email: string, password: string) => {
  if (!isFirebaseConfigured || !auth || !email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
}

export const signInUser = async (email: string, password: string) => {
  if (!isFirebaseConfigured || !auth || !email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
}

export const signOutUser = async () => {
  if (!isFirebaseConfigured || !auth) return;
  await signOut(auth);
};