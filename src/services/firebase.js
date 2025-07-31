// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Replace these with your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyBEbZUw6LId2zgCffRRAOK6Q5Z6WguqeCM",
  authDomain: "blog-app-d8abc.firebaseapp.com",
  projectId: "blog-app-d8abc",
  storageBucket: "blog-app-d8abc.firebasestorage.app",
  messagingSenderId: "1020842516702",
  appId: "1:1020842516702:web:11410cd387444901a9224f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
