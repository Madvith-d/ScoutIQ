// import { verifyToken } from "../../middleware/auth.js";
// import express from "express";

// const router = express.Router();

// router.get("/verify", verifyToken, (req, res) => {
//     res.json({ message: "User verified successfully", user: req.user });
// })

// export default router;


import express from "express";
import { verifyAuth } from "../middleware/auth.js";

const router = express.Router();

// Verify token endpoint
router.get("/verify", verifyAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: "Token valid", 
    user: {
      uid: req.user.uid,
      email: req.user.email,
      emailVerified: req.user.email_verified
    }
  });
});

export default router;