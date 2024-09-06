import { Request, Response } from "express";
import { ZodError } from "zod";
import { userSchema } from "../../schemas/users/userSchema";
import UserRegistrations from "../../models/users/userRegistrationsModel";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../config/connection";
import UserMiscellaneousDetails from "../../models/users/userMiscellaneousDetailsModel";

export const createUser = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    userSchema.parse(req.body);

    const existingUser = await UserRegistrations.findOne({
      where: {
        email: req.body.email,
        is_active: true,
      },
      transaction,
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Email already exists",
        status: 409,
      });
    }

    await UserRegistrations.create(
      {
        user_id: uuidv4().replace(/-/g, ""),
        username: req.body.username,
        full_name: req.body.fullName,
        email: req.body.email,
      },
      { transaction }
    );
    await transaction.commit();

    res.status(201).json({ message: "User created successfully", status: 201 });
  } catch (error) {
    await transaction.rollback();

    if (error instanceof ZodError) {
      res.status(400).json({
        message: "Failed to create user",
        errors: error.errors,
        status: 400,
      });
    } else {
      res.status(400).json({
        message: "Failed to create user",
        errors: "An unexpected error occurred",
        status: 400
      });
    }
  }
};

export const getUserMiscellaneousDetailsById = async (req: Request, res: Response) => {

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid or missing userId parameter" });
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await UserRegistrations.findOne({
      attributes: [
        'user_id',
        'username',
        'full_name',
        'email',
      ],
      include: [{
        model: UserMiscellaneousDetails,
        attributes: ['bio', 'preferences', 'age', 'country'],
        required: false,
      }],
      where: {
        is_active: true,
        user_id: userId,
      },
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    await transaction.commit();

    const userData = {
      userId: user.user_id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      bio: user.UserMiscellaneousDetail?.bio || null,
      preferences: user.UserMiscellaneousDetail?.preferences || null,
      age: user.UserMiscellaneousDetail?.age || null,
      country: user.UserMiscellaneousDetail?.country || null
    };

    return res.status(200).json({
      message: "User profile details fetched successfully",
      data: userData,
      status: 200
    });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({
      message: "Failed to fetch user profile details",
      errors: error,
      status: 400
    });
  }
};