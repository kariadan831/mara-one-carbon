import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// export raw admin (safe)
export default admin;
export const db = admin.firestore();