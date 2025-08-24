import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Support both a full JSON string in FIREBASE_SERVICE_ACCOUNT or individual env vars
function getServiceAccountFromEnv() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT is not valid JSON");
    }
  }

  const required = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];

  const hasAll = required.every((k) => !!process.env[k]);
  if (!hasAll) return null;

  // Private key may come with literal \n in dashboards; fix them
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

  return {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: privateKey,
  };
}

const serviceAccount = getServiceAccountFromEnv();

if (!admin.apps.length) {
  if (!serviceAccount) {
    throw new Error(
      "Firebase service account not configured. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY"
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const auth = admin.auth();
const firestore = admin.firestore();
export { auth, firestore };
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
//     databaseURL: process.env.FIREBASE_DATABASE_URL
//   });
// }

// export const auth = admin.auth();
// export const firestore = admin.firestore();
// export default admin;