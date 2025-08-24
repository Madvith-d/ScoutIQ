import mammoth from "mammoth";

export class ExtractService {
  static async extractText(file) {
    try {
      const { mimetype, buffer } = file;
      
      switch (mimetype) {
        case "application/pdf":
          // For MVP, ask users to convert PDF to DOCX
          throw new Error("PDF files are not supported yet. Please upload a DOCX or TXT file.");
        
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          return await this.extractDOCX(buffer);
        
        case "text/plain":
          return buffer.toString('utf-8');
        
        default:
          throw new Error(`Unsupported file type: ${mimetype}. Please upload DOCX or TXT files.`);
      }
    } catch (error) {
      console.error("Text extraction error:", error);
      throw error; // Re-throw the original error with helpful message
    }
  }

  static async extractDOCX(buffer) {
    try {
      const { value } = await mammoth.extractRawText({ buffer });
      return this.cleanText(value);
    } catch (error) {
      throw new Error("Failed to extract text from DOCX file. Please ensure the file is not corrupted.");
    }
  }

  static cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }
}