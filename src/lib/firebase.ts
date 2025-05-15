// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQrEz0uc-s9eB3xYXxukoytJ-x6weWKXs",
  authDomain: "stasis-ufrrj.firebaseapp.com",
  projectId: "stasis-ufrrj",
  storageBucket: "stasis-ufrrj.firebasestorage.app",
  messagingSenderId: "863729257428",
  appId: "1:863729257428:web:1d7d2c4ff5a852b07b6441",
  measurementId: "G-54P05GTC95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
