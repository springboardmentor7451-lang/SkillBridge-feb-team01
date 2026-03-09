import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import opportunityRoutes from "../routes/opportunityRoutes.js";
import { errorHandler } from "../middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Centralized error handling middleware (must be last)
app.use(errorHandler);

export default app;
