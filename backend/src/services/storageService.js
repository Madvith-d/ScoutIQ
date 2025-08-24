import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../config/cloudflare.js";
import { v4 as uuid } from "uuid";

export class StorageService {
  static async uploadResume(file, userId) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const key = `resumes/${userId}/${uuid()}.${fileExtension}`;
      
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          userId: userId,
          originalName: file.originalname,
          uploadDate: new Date().toISOString()
        }
      });

      await r2.send(command);
      return key;
    } catch (error) {
      console.error("Storage upload error:", error);
      throw new Error("Failed to upload file to storage");
    }
  }

  static async getResumeUrl(key) {
    try {
      // For public access or generate signed URL if needed
      return `https://${process.env.R2_BUCKET}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;
    } catch (error) {
      console.error("Get URL error:", error);
      throw new Error("Failed to generate file URL");
    }
  }
}