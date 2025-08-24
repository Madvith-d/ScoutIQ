import { auth } from "../config/firebase.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No authorization token provided" });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};