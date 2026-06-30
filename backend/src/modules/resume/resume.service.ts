import streamifier from "streamifier";
import { v4 as uuid } from "uuid";
import { extractPdfText } from "../../lib/pdf.js";

import cloudinary from "../../lib/cloudinary.js";
import Resume from "../../models/Resume.js";

export const uploadResume = async (
  userId: string,
  file: Express.Multer.File,
  title?: string,
) => {
  // Extract text from PDF
  const extractedText = await extractPdfText(file.buffer);

  // Upload PDF to Cloudinary
  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "resume-analyzer",
        resource_type: "raw",
        public_id: uuid(),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

  // Save resume in MongoDB
  const resume = await Resume.create({
    user: userId,
    title: title || file.originalname,
    originalName: file.originalname,
    fileName: uploadResult.public_id,
    fileUrl: uploadResult.secure_url,
    extractedText,
  });

  return resume;
};
