import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async ({ name, email, password }: RegisterInput) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const getCurrentUser = async (id: string) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
