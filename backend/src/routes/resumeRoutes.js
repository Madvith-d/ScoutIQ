// src/routes/resumeRoutes.js - Updated for MVP
import express from "express";
import multer from "multer";
import { verifyAuth } from "../middleware/auth.js";
import { ResumeController } from "../controllers/resumeController.js";

const router = express.Router();

// Configure multer for file uploads (MVP: DOCX + TXT only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      // 'application/pdf', // Temporarily disabled for MVP
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only DOCX and TXT files are supported in MVP. PDF support coming soon!'));
    }
  }
});

// Routes
router.post('/analyze', verifyAuth, upload.single('resume'), ResumeController.uploadAndAnalyze);
router.get('/history', verifyAuth, ResumeController.getAnalysisHistory);
router.get('/stats', verifyAuth, ResumeController.getUserStats);
router.get('/:id', verifyAuth, ResumeController.getAnalysisById);

export default router;