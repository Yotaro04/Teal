/**
 * ブラウザ用: firebase-config.js の単一初期化 + Firestore/Storage モジュラー API を window.__TF に公開
 */
import { db, storage } from './firebase-config.js';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    runTransaction,
    serverTimestamp,
    deleteField
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const bundleRef = doc(db, 'teertabSync', 'bundle');
const userDefaultRef = doc(db, 'users', 'default');

window.__TF = {
    db,
    storage,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    onSnapshot,
    runTransaction,
    serverTimestamp,
    deleteField,
    bundleRef,
    userDefaultRef,
    storageRef: ref,
    uploadString,
    getDownloadURL,
    ready: true
};
