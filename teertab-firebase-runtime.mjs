/**
 * ブラウザ用: firebase-config.js の単一初期化 + Firestore/Storage モジュラー API を window.__TF に公開
 */
import { db, storage, auth } from './firebase-config.js';
import {
    doc,
    collection,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    runTransaction,
    serverTimestamp,
    deleteField
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

const bundleRef = doc(db, 'teertabSync', 'bundle');

window.__TF = {
    db,
    storage,
    auth,
    doc,
    collection,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    runTransaction,
    serverTimestamp,
    deleteField,
    bundleRef,
    userDocRef: (uid) => doc(db, 'users', String(uid || '')),
    userCardsColRef: (uid) => collection(db, 'users', String(uid || ''), 'cards'),
    userCardDocRef: (uid, cardId) => doc(db, 'users', String(uid || ''), 'cards', String(cardId || '')),
    storageRef: ref,
    uploadString,
    getDownloadURL,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    ready: true
};
