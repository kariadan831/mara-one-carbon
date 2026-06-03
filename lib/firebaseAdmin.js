import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountEnv) {
    throw new Error(
      "❌ FIREBASE_SERVICE_ACCOUNT is missing in environment variables"
    );
  }

  let serviceAccount;

  try {
    serviceAccount = JSON.parse(serviceAccountEnv);
  } catch (error) {
    throw new Error(
      "❌ FIREBASE_SERVICE_ACCOUNT is not valid JSON. Check your .env.local format."
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;