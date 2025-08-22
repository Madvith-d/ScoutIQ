import { verifyToken } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.get("/verify", verifyToken, (req, res) => {
    res.json({ message: "User verified successfully", user: req.user });
})

export default router;