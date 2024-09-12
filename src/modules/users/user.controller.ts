import { Request, Response } from "express";
import { ZodError } from "zod";
import { createUserSchema } from "../../schemas/users/create-user.schema";
import { v4 as uuidv4 } from "uuid";
import { firebaseConfig } from "../../configs/firebase.config";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
} from "firebase/storage";
import { sequelize } from "../../configs/db-connection.config";
import UserRegistrations from "../../models/users/user-registrations.model";
import UserMiscellaneousDetails from "../../models/users/user-miscellaneous-details.model";

initializeApp(firebaseConfig);

const storage = getStorage();

export const createUser = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    createUserSchema.parse(req.body);

    const existingUserByUsername = await UserRegistrations.findOne({
      where: {
        username: req.body.username,
        is_active: true,
      },
      transaction,
    });

    if (existingUserByUsername) {
      await transaction.rollback();
      return res.status(409).json({
        message: "Username already taken",
        status: 409,
      });
    }
    const existingUserByEmail = await UserRegistrations.findOne({
      where: {
        email: req.body.email,
        is_active: true,
      },
      transaction,
    });

    if (existingUserByEmail) {
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

    res.status(201).json({
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    if (error instanceof ZodError) {
      res.status(400).json({
        message: error.errors[0].message,
        status: 400
      });
    } else {
      res.status(400).json({
        message: "Failed to create user",
        errors: error,
        status: 400
      });
    }
  }
};

export const getProfileDetails = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({
      message: "Invalid or missing userId parameter",
      status: 400,
    });
  }

  const transaction = await sequelize.transaction();
  try {
    const user = await UserRegistrations.findOne({
      attributes: ["user_id", "username", "full_name", "email"],
      include: [
        {
          model: UserMiscellaneousDetails,
          attributes: [
            "bio",
            "preferences",
            "age",
            "gender",
            "country",
            "profile_photo_storage_bucket_filepath",
          ],
          required: false,
        },
      ],
      where: {
        is_active: true,
        user_id: userId,
      },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    let userProfilePhotoDownloadURL = null;

    if (user.UserMiscellaneousDetail?.profile_photo_storage_bucket_filepath) {
      try {
        const storageRef = ref(
          storage,
          user.UserMiscellaneousDetail?.profile_photo_storage_bucket_filepath
        );
        const metadata = await getMetadata(storageRef);
        if (metadata) {
          const storageRef = ref(
            storage,
            user.UserMiscellaneousDetail?.profile_photo_storage_bucket_filepath
          );
          userProfilePhotoDownloadURL = await getDownloadURL(storageRef);
        }
      } catch (error) { 
        console.log(error);
      }
    }

    const userData = {
      userId: user.user_id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      bio: user.UserMiscellaneousDetail?.bio || null,
      preferences: user.UserMiscellaneousDetail?.preferences || null,
      age: user.UserMiscellaneousDetail?.age || null,
      gender: user.UserMiscellaneousDetail?.gender || null,
      country: user.UserMiscellaneousDetail?.country || null,
      userProfilePhotoDownloadURL: userProfilePhotoDownloadURL,
    };

    await transaction.commit();
    return res.status(200).json({
      message: "User profile details fetched successfully",
      data: userData,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    res.status(400).json({
      message: "Failed to fetch user profile details",
      errors: error,
      status: 400,
    });
  }
};

export const updateProfilePhoto = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({
      message: "Invalid or missing userId parameter",
      status: 400,
    });
  }
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({
      message: "No file provided or file is empty",
      status: 400,
    });
  }

  const allowedMimeTypes = ["image/jpeg", "image/png"];

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: "Invalid file type. Only image files are allowed (jpeg, png).",
      status: 400,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await UserRegistrations.findOne({
      attributes: ["user_id", "username"],
      include: [
        {
          model: UserMiscellaneousDetails,
          attributes: ["profile_photo_storage_bucket_filepath"],
          required: false,
        },
      ],
      where: {
        is_active: true,
        user_id: userId,
      },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    const previousFilepath =
      user.UserMiscellaneousDetail?.profile_photo_storage_bucket_filepath ||
      null;

    if (previousFilepath) {
      const previousFileRef = ref(storage, previousFilepath);

      try {
        const metadata = await getMetadata(previousFileRef);

        if (metadata) {
          await deleteObject(previousFileRef);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const fileExtension = req.file.originalname.split(".").pop();
    const profilePhotoStorageBucketFilepath = `files/users/${userId}/profile-photo/${user.username
      }_${uuidv4().replace(/-/g, "")}.${fileExtension}`;
    const storageRef = ref(storage, profilePhotoStorageBucketFilepath);
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const userProfilePhotoDownloadURL = await getDownloadURL(snapshot.ref);

    await UserMiscellaneousDetails.update(
      {
        profile_photo_storage_bucket_filepath:
          profilePhotoStorageBucketFilepath,
      },
      {
        where: { user_id: userId },
        transaction,
      }
    );

    await transaction.commit();

    return res.status(200).json({
      message: "Profile photo updated successfully",
      data: {
        userId: userId,
        userProfilePhotoDownloadURL: userProfilePhotoDownloadURL,
      },
      status: 200,
    });
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    res.status(400).json({
      message: "Failed to update profile photo",
      errors: error,
      status: 400,
    });
  }
};
