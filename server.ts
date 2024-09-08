import express from "express";
import { conn } from "./config/connection"; 
import userRouter from "./routes/users/userRouter";
import cors from "cors";

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

app.use("/users",userRouter);

conn().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error("Failed to start the server:", error);
});
