import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./scoutiq-6c64b-firebase-adminsdk-fbsvc-e0be802d3d.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://resume-analyzer-341215-default-rtdb.firebaseio.com"
});

const auth = admin.auth();
export { auth };