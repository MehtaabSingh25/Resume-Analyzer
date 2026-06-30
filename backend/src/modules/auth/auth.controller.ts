import { Request, Response } from "express";
import { register, login } from "./auth.service.js";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import { getCurrentUser } from "./auth.service.js";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = await login(req.body);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const currentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await getCurrentUser(req.user!.id);

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
