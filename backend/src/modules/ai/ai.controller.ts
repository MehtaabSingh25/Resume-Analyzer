import { Request, Response } from "express";
import { analyzeResume } from "./ai.service.js";

export const analyze = async (
  req: Request,
  res: Response
) => {
  try {
    const resumeId = Array.isArray(req.params.resumeId)
      ? req.params.resumeId[0]
      : req.params.resumeId;
    const result = await analyzeResume(resumeId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};