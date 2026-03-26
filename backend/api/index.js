import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import { errorHandler } from "../middleware/errorMiddleware.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import opportunityRoutes from "../routes/opportunityRoutes.js";
import applicationRoutes from "../routes/applicationRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";
import messageRoutes from "../routes/messageRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error Middleware
app.use(errorHandler);

export default app;