import { Router } from "express";
import StatsController from "../controllers/StatsController.js";
import { verifyAdmin, verifyLandlord } from "../middlewares/verifyToken.js";

const router = Router();

// thống kê bài viết của chủ trọ. id truyển trên đường dẫn là id của người dùng có vai trò landlord
router.get(
  "/landlords/:id/stats",
  verifyLandlord,
  StatsController.getStatsOfPostByLandlord
);

// Thống kê số lượng người dùng đã đăng ký theo năm, quý, tháng
router.get("/admin/users/stats", verifyAdmin, StatsController.getStatsOfUser);

// Thống kê số lượng bài viết theo năm, quý, tháng
router.get("/admin/posts/stats", verifyAdmin, StatsController.getStatsOfPost);

export default router;
