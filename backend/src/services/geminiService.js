import fetch from "node-fetch";

export class GeminiService {
  static async analyzeResume(resumeText, jobDescription) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: this.buildAnalysisPrompt(resumeText, jobDescription)
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      return this.parseAIResponse(aiText);
    } catch (error) {
      console.error("Gemini analysis error:", error);
      throw new Error("Failed to analyze resume with AI");
    }
  }

  static buildAnalysisPrompt(resumeText, jobDescription) {
    return `
You are an expert ATS (Applicant Tracking System) resume analyzer. 
Analyze the following resume against the given job description and provide detailed feedback.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Please analyze and return ONLY valid JSON in this exact structure:
{
  "ats_score": number (0-100),
  "strengths": [string, string, ...],
  "weaknesses": [string, string, ...],
  "improvements": [string, string, ...],
  "missing_keywords": [string, string, ...],
  "matched_keywords": [string, string, ...],
  "summary": string
}

Evaluation criteria:
1. Keyword matching between resume and job description
2. Skills alignment
3. Experience relevance
4. Education requirements
5. Resume formatting and structure
6. Quantifiable achievements

Be specific and actionable in your feedback.
    `;
  }

  static parseAIResponse(aiText) {
    try {
      // Clean the response if it has markdown formatting
      const cleanedText = aiText.replace(/```json\n?|```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      // Validate structure
      return {
        ats_score: Math.min(100, Math.max(0, parsed.ats_score || 0)),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        missing_keywords: Array.isArray(parsed.missing_keywords) ? parsed.missing_keywords : [],
        matched_keywords: Array.isArray(parsed.matched_keywords) ? parsed.matched_keywords : [],
        summary: parsed.summary || "Analysis completed"
      };
    } catch (error) {
      console.error("Failed to parse AI response:", aiText);
      return {
        ats_score: 0,
        strengths: [],
        weaknesses: [],
        improvements: [],
        missing_keywords: [],
        matched_keywords: [],
        summary: "Error parsing AI response. Please try again."
      };
    }
  }
}