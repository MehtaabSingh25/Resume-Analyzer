import { Router } from "express";

import authMiddleware from "../../middleware/auth.Middleware.js";
import { analyze } from "./ai.controller.js";

const router = Router();

router.post(
  "/analyze/:resumeId",
  authMiddleware,
  analyze
);

export default router;