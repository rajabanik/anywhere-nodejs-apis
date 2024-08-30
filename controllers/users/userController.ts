import { Request, Response } from "express";
import { ZodError } from "zod";
import { userSchema } from "../../schemas/users/userSchema";
import User from "../../models/users/userModel";
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (req: Request, res: Response) => {
  try {
    userSchema.parse(req.body);
    const existingUser = await User.findOne({
      where: {
        email: req.body.email,
        is_active: true
      }
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
        status: 409,
      });
    }
    const user = await User.create({
      user_id: uuidv4().replace(/-/g, ''),
      username: req.body.username,
      full_name: req.body.fullName,
      email: req.body.email
    });

    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Failed to create user",
        errors: error.errors,
        status: 400,
      });
    } else {
      console.error("Internal server error:", error);
      res.status(500).json({
        message: "Internal server error",
        errors: { message: "An unexpected error occurred", status: 500 },
      });
    }
  }
};
