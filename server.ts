import express from "express";
import cors from "cors";
import { conn } from "./src/configs/db-connection.config";
import userRouter from "./src/modules/users/user.route";
import mailRouter from "./src/modules/mails/mail.route";
import otpRouter from "./src/modules/otp/otp.route";

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: "*",
  methods: ["*"],
  allowedHeaders: ["*"],
  credentials: true,
};

app.use(express.json());

app.use(cors(corsOptions));

app.use("/user", userRouter);
app.use("/mail", mailRouter);
app.use("/otp", otpRouter);

(async () => {
  try {
    await conn();

    app.listen(port, () => {
      console.log(`Server is running on http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error("Failed to start application:", error);
  }
})();