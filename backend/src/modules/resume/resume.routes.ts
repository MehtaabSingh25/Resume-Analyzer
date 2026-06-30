import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

import { uploadResume } from "./resume.controller.js";

const router = Router();

router.post(
  "/upload",

  authMiddleware,

  upload.single("resume"),

  uploadResume,
);

export default router;
