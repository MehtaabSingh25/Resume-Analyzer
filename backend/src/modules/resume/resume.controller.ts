import { Request, Response } from "express";
import * as resumeService from "./resume.service.js";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const uploadResume = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume PDF is required",
      });
    }

    const result = await resumeService.uploadResume(
      req.user!.id,
      req.file,
      req.body.title,
    );

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
