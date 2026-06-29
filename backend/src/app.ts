import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Resume Analyzer Backend is Running 🚀",
  });
});

app.use("/api/auth", authRoutes);

export default app;
