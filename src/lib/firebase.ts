// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Import getStorage
import { getFirestore } from "firebase/firestore"; // Import getFirestore
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaouQ7kRRDcCQ3D1xSuTmnYJwD-Qp8DA8",
  authDomain: "stasis-ufrrj.firebaseapp.com",
  projectId: "stasis-ufrrj",
  storageBucket: "stasis-ufrrj.firebasestorage.app",
  messagingSenderId: "144873138233",
  appId: "1:144873138233:web:47d7dbd1904c00cce245e8",
  measurementId: "G-VKEXBXWDFT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize Firebase Storage
const db = getFirestore(app); // Initialize Firestore

// Export the storage instance
export { app, analytics, storage, db };