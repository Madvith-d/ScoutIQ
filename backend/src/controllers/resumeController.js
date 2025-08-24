import { StorageService } from "../services/storageService.js";
import { ExtractService } from "../services/extractService.js";
import { GeminiService } from "../services/geminiService.js";
import { firestore } from "../config/firebase.js";

export class ResumeController {
  static async uploadAndAnalyze(req, res) {
    try {
      const { jobDescription } = req.body;
      const file = req.file;
      const userId = req.user.uid;

      if (!file) {
        return res.status(400).json({ error: "No resume file provided" });
      }

      if (!jobDescription) {
        return res.status(400).json({ error: "Job description is required" });
      }

      // 1. Upload file to R2
      const fileKey = await StorageService.uploadResume(file, userId);

      // 2. Extract text from resume
      const resumeText = await ExtractService.extractText(file);

      // 3. Analyze with Gemini
      const analysis = await GeminiService.analyzeResume(resumeText, jobDescription);

      // 4. Save to Firestore
      const resumeDoc = {
        userId,
        fileKey,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        extractedText: resumeText,
        jobDescription,
        analysis,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await firestore.collection('resumes').add(resumeDoc);

      res.json({
        success: true,
        resumeId: docRef.id,
        analysis,
        fileUrl: await StorageService.getResumeUrl(fileKey)
      });

    } catch (error) {
      console.error("Upload and analyze error:", error);
      res.status(500).json({ 
        error: "Failed to process resume", 
        details: error.message 
      });
    }
  }

  static async getAnalysisHistory(req, res) {
    try {
      const userId = req.user.uid;
      const { page = 1, limit = 10 } = req.query;

      const snapshot = await firestore
        .collection('resumes')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(parseInt(limit))
        .offset((parseInt(page) - 1) * parseInt(limit))
        .get();

      const analyses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      }));

      res.json({
        success: true,
        analyses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: snapshot.size
        }
      });

    } catch (error) {
      console.error("Get history error:", error);
      res.status(500).json({ error: "Failed to fetch analysis history" });
    }
  }

  static async getAnalysisById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      const doc = await firestore.collection('resumes').doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      const data = doc.data();
      
      if (data.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json({
        success: true,
        analysis: {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        }
      });

    } catch (error) {
      console.error("Get analysis error:", error);
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  }
}