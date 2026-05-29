import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV2UjO5XK_bCv6oSvGiSQvqwyzNqDkH5k",
  authDomain: "mara-one-carbon.firebaseapp.com",
  projectId: "mara-one-carbon",
  storageBucket: "mara-one-carbon.appspot.com",
  messagingSenderId: "82060100425",
  appId: "1:82060100425:web:10cffe170a60aca4ab9098",
  measurementId: "G-C176HDN5GL"
};

// Prevent multiple initialization (Next.js safe mode)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore (client-side only)
export const db = getFirestore(app);