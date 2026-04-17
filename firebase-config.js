import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Web アプリ設定。index.html は import map 経由でこのモジュールを読み込みます。
// Firestore: users/{uid}（プロフィール・dismissedNotifs）+ posts（全ユーザー共通募集）+ teertabSync/bundle（共有同期）
// Storage: users/{uid}/profile.jpg, profilePhotos/*, volImages/*
const firebaseConfig = {
  apiKey: "AIzaSyC1a9c04Ffc7FRqarA0uj4up9ksfXAjphw",
  authDomain: "teertab-da748.firebaseapp.com",
  projectId: "teertab-da748",
  storageBucket: "teertab-da748.firebasestorage.app",
  messagingSenderId: "836475342617",
  appId: "1:836475342617:web:088031783a05a3a23e7f88",
  measurementId: "G-XF37B57WHT"
};

const app = initializeApp(firebaseConfig);
try {
  if (typeof window !== "undefined" && firebaseConfig.measurementId) {
    getAnalytics(app);
  }
} catch (_) {
  /* Analytics は未対応環境やブロック時に失敗しうる */
}

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export { app, firebaseConfig };
