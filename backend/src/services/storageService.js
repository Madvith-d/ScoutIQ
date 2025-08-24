import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../config/cloudflare.js";
import { v4 as uuid } from "uuid";

export class StorageService {
  static async uploadResume(file, userId) {
    try {
      console.log('Starting file upload to R2...');
      console.log('Environment variables:', {
        bucket: process.env.CLOUDFLARE_R2_BUCKET,
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        hasAccessKey: !!process.env.CLOUDFLARE_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.CLOUDFLARE_SECRET_ACCESS_KEY
      });
      
      const fileExtension = file.originalname.split('.').pop();
      const key = `resumes/${userId}/${uuid()}.${fileExtension}`;
      
      console.log('File details:', {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        key: key
      });
      
      const command = new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          userId: userId,
          originalName: file.originalname,
          uploadDate: new Date().toISOString()
        }
      });

      console.log('Sending command to R2...');
      await r2.send(command);
      console.log('File uploaded successfully to R2');
      return key;
    } catch (error) {
      console.error("Storage upload error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        statusCode: error.$metadata?.httpStatusCode
      });
      
      // For development, we can skip storage and just return a mock key
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Skipping R2 storage, using mock key');
        return `mock-resumes/${userId}/${uuid()}.${file.originalname.split('.').pop()}`;
      }
      
      throw new Error(`Failed to upload file to storage: ${error.message}`);
    }
  }

  static async getResumeUrl(key) {
    try {
      // Handle mock keys for development
      if (key.startsWith('mock-resumes/')) {
        return `mock://${key}`;
      }
      
      // For public access or generate signed URL if needed
      return `https://${process.env.CLOUDFLARE_R2_BUCKET}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    } catch (error) {
      console.error("Get URL error:", error);
      throw new Error("Failed to generate file URL");
    }
  }
}