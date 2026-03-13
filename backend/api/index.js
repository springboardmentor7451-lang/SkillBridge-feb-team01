import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";

import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import opportunityRoutes from "../routes/opportunityRoutes.js";
import applicationRoutes from "../routes/applicationRoutes.js"; 

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes); 

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;