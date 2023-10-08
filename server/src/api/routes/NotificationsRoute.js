import { Router } from "express";
import NotificationsController from "../controllers/NotificationsController.js";
import { verifyToken, verifyUser } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/notifications/create/", verifyToken, NotificationsController.create); // Tạo thông báo
router.get("/notifications/:id", verifyUser, NotificationsController.getAllNotificationByReceiver); // Lấy danh sách các thông báo theo id người dùng

export default router;