import express from "express";
import cors from "cors";
import { conn } from "./configs/dbConnectionConfig";
import userRouter from "./routes/users/userRouter";

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

app.use("/users", userRouter);

(async () => {
  try {
    await conn();

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error);
  }
})();