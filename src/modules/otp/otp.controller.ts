import { Request, Response } from "express";
import { ZodError } from "zod";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { sequelize } from "../../configs/db-connection.config";
import { generateOtp } from "../../utils/otp.util";
import { getCurrentDateTimeUTC } from "../../utils/datetime.util";
import { sendOtpSchema } from "../../schemas/otp/send-otp.schema";
import { updateOtpStatusSchema } from "../../schemas/otp/update-otp-status.schema";
import { verifyOtpSchema } from "../../schemas/otp/verify-otp.schema";
import OtpLogs from "../../models/otp/otp-logs.model";

dotenv.config();

export class OtpController {

  constructor() { }

  async sendOtp(req: Request, res: Response) {
    const otp = generateOtp();
    const otpId = "otp_" + uuidv4().replace(/-/g, "");
    const transaction = await sequelize.transaction();

    try {
      const validatedBody = sendOtpSchema.parse(req.body);
      const { userId } = validatedBody;
      const response = await fetch(`${process.env.NODEJS_API_BASE_URL}/mail/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: [req.body.email],
          subject: "Your OTP Code for Verification",
          body: {
            text: `Hi ${req.body.username},\n\nYour one-time password (OTP) for verifying your identity is: ${otp}.\n\nThis code is valid for the next 30 seconds.\n\nIf you did not request this OTP, please disregard this message.\n\nBest regards,\nAnywhere Team`,
            html: `<p>Hi ${req.body.username},</p><p>Your one-time password (OTP) for verifying your identity is: <strong>${otp}</strong>.</p><p>This code is valid for the next 30 seconds.</p><p>If you did not request this OTP, please disregard this message.</p><p>Best regards,<br>Anywhere Team</p>`
          }
        })
      });

      const sendMailApiResponse = await response.json();
      if (sendMailApiResponse.status == 200) {
        await OtpLogs.create(
          {
            otp_id: otpId,
            user_id: userId,
            otp: otp,
            status: "PENDING",
            generated_on: getCurrentDateTimeUTC()
          },
          { transaction }
        );
        await transaction.commit();
        return res.status(200).json({
          message: "OTP sent successfully",
          data: {
            otpId: otpId,
            userId: userId,
            status: "PENDING"
          },
          status: 200
        });
      } else {
        return res.status(response.status).json({
          message: "Failed to send OTP",
          errors: sendMailApiResponse.errors || "An unexpected error occurred",
          status: response.status
        });
      }
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          status: 400
        });
      }
      return res.status(400).json({
        message: "Failed to send OTP",
        errors: error,
        status: 400
      });
    }
  }

  async updateOtpStatus(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const validatedBody = updateOtpStatusSchema.parse(req.body);
      const { otpId, status } = validatedBody;

      const existingOtpId = await OtpLogs.findOne({
        where: {
          otp_id: otpId,
        },
        transaction,
      });

      if (!existingOtpId) {
        await transaction.rollback();
        return res.status(400).json({
          message: "otpId not found",
          status: 400,
        });
      }

      await OtpLogs.update(
        {
          status: status,
        },
        {
          where: {
            otp_id: otpId,
            status: "PENDING"
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(200).json({
        message: "OTP status updated successfully",
        status: 200
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          status: 400
        });
      }
      return res.status(400).json({
        message: "Failed to update OTP status",
        errors: error,
        status: 400
      });
    }
  }

  async verifyOtp(req: Request, res: Response) {
    const transaction = await sequelize.transaction();

    try {
      const validatedBody = verifyOtpSchema.parse(req.body);
      const { userId, otp } = validatedBody;

      const existingOtpLog = await OtpLogs.findOne({
        where: {
          user_id: userId,
        },
        order: [["generated_on", "DESC"]],
        limit: 1,
        transaction,
      });

      if (!existingOtpLog) {
        await transaction.rollback();
        return res.status(400).json({
          message: "OTP log not found",
          status: 400,
        });
      }

      if (existingOtpLog.otp !== otp) {
        await OtpLogs.update(
          {
            status: "UNVERIFIED"
          },
          {
            where:
            {
              otp_id: existingOtpLog.otp_id
            },
            transaction
          }
        );
        await transaction.commit();
        return res.status(400).json({
          message: "Invalid OTP",
          status: 400,
        });
      }

      if (existingOtpLog.status === "EXPIRED") {
        await transaction.rollback();
        return res.status(400).json({
          message: "OTP has expired",
          status: 400,
        });
      }

      await OtpLogs.update(
        {
          status: "VERIFIED"
        },
        {
          where:
          {
            otp_id: existingOtpLog.otp_id
          },
          transaction
        }
      );
      await transaction.commit();
      return res.status(200).json({
        message: "OTP verified successfully",
        data: {
          otpId: existingOtpLog.otp_id,
          userId: existingOtpLog.user_id,
          status: "VERIFIED"
        },
        status: 200
      });
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: error.errors[0].message,
          status: 400
        });
      }
      return res.status(400).json({
        message: "Failed to update OTP status",
        errors: error,
        status: 400
      });
    }
  }
}
