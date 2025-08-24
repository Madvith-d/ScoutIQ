import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./scoutiq-6c64b-firebase-adminsdk-fbsvc-e0be802d3d.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const auth = admin.auth();
const firestore = admin.firestore();
export { auth, firestore };

// import admin from "firebase-admin";
// import dotenv from "dotenv";

// dotenv.config();

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
//     databaseURL: process.env.FIREBASE_DATABASE_URL
//   });
// }

// export const auth = admin.auth();
// export const firestore = admin.firestore();
// export default admin;