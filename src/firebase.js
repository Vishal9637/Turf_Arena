import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyCVLZXNWwAiweRXyKBOa4qx86nr0ayhp98",
  authDomain: "turfarena.firebaseapp.com",
  projectId: "turfarena",
  storageBucket: "turfarena.appspot.com", // ✅ FIXED (IMPORTANT)
  messagingSenderId: "655565147394",
  appId: "1:655565147394:web:51ba3288e64e75b5bdc61b",
  measurementId: "G-N2QZMV5KE6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ EXPORT STORAGE
