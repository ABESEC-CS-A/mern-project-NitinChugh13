// src/config/firebase.js  (or wherever your file lives)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginurbancartx.firebaseapp.com",
  projectId: "loginurbancartx",
  storageBucket: "loginurbancartx.firebasestorage.app",
  messagingSenderId: "377575027414",
  appId: "1:377575027414:web:1e692e3b06e30ec44acf77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
