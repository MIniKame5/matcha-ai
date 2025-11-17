import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Firebase設定を一つに統合。通常、AuthとFirestoreは同じプロジェクト設定を共有します。
// 環境変数から設定を読み込みます。
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// 必要な設定（apiKeyとprojectId）が存在するかどうかを確認
const isConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

if (isConfigured) {
  try {
    // Firebaseアプリを初期化
    app = initializeApp(firebaseConfig);
    // 初期化したアプリからAuthとFirestoreのインスタンスを取得
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    // 初期化に失敗した場合は、すべてnullにリセット
    app = null;
    auth = null;
    db = null;
  }
} else {
  // 設定が不完全な場合は警告を表示
  console.warn("Firebase config is missing. Firebase features will be disabled. Please set up Firebase environment variables.");
}

// 設定が完了しているかどうかを示すフラグと、Auth/DBインスタンスをエクスポート
export const isFirebaseConfigured = !!auth && !!db;
export { auth, db };
