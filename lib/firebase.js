import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV2UjO5XK_bCv6oSvGiSQvqwyzNqDkH5k",
  authDomain: "mara-one-carbon.firebaseapp.com",
  projectId: "mara-one-carbon",
  storageBucket: "mara-one-carbon.firebasestorage.app",
  messagingSenderId: "82060100425",
  appId: "1:82060100425:web:10cffe170a60aca4ab9098",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);