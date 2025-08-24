import fetch from "node-fetch";

export class GeminiService {
  static async analyzeResume(resumeText, jobDescription) {
    try {
      console.log('Starting Gemini API analysis...');
      console.log('API Key available:', !!process.env.GEMINI_API_KEY);
      
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      console.log('API URL:', url.replace(process.env.GEMINI_API_KEY, '***'));
      
      const prompt = this.buildAnalysisPrompt(resumeText, jobDescription);
      console.log('Prompt length:', prompt.length);
      
      const response = await fetch(url, {
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
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      console.log('Gemini API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response data keys:', Object.keys(data));
      
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      console.log('AI response text length:', aiText.length);

      return this.parseAIResponse(aiText);
    } catch (error) {
      console.error("Gemini analysis error:", error);
      
      // For development, return mock analysis if API fails
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Returning mock analysis');
        return {
          ats_score: 75,
          strengths: ["Good technical skills", "Relevant experience"],
          weaknesses: ["Could improve keyword matching"],
          improvements: ["Add more specific keywords", "Quantify achievements"],
          missing_keywords: ["React", "TypeScript"],
          matched_keywords: ["JavaScript", "HTML", "CSS"],
          summary: "Mock analysis for development"
        };
      }
      
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