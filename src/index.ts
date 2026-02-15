import express from "express";
import cors from "cors";
import { connectToDatabase } from "./shared/database/sequalize";
import authRouter from "./modules/user/presentation/routes/user.routes";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 1234;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

connectToDatabase();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;