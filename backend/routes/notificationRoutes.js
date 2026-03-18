import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications
} from "../controllers/notificationController.js";

const router = express.Router();

// Require authentication for all notification routes
router.use(protect);

router.get("/", getMyNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/", clearAllNotifications);

export default router;
