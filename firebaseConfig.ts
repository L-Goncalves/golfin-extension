import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";

// Your web app's Firebase configuration using Plasmo public env variables
const firebaseConfig = {
  apiKey: process.env.PLASMO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional if using analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
