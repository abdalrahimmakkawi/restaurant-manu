import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  projectId:         "house-of-books-489311",
  appId:             "1:843772185979:web:aa553846b6acf4aa6741de",
  apiKey:            "AIzaSyBTRjL0TESvCkwHBCCnFov31wrB2pJRTRI",
  authDomain:        "house-of-books-489311.firebaseapp.com",
  storageBucket:     "house-of-books-489311.firebasestorage.app",
  messagingSenderId: "843772185979",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app, "ai-studio-c0c13f44-f062-4b12-ac12-eab5b335bd90");

export {
  auth, db,
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup, updateProfile,
  collection, doc, addDoc, updateDoc, deleteDoc, getDocs,
  onSnapshot, query, where, orderBy, serverTimestamp, Timestamp,
};
