import { Router } from "express";
import StatsController from "../controllers/StatsController.js";
import { verifyAdmin, verifyLandlord } from "../middlewares/verifyToken.js";

const router = Router();

// thống kê bài viết của chủ trọ. id truyển trên đường dẫn là id của người dùng có vai trò landlord
router.get("/landlords/:id/stats",verifyLandlord, StatsController.getStatsOfPost); 
router.get("/users/admin/stats", verifyAdmin, StatsController.getStatsUser)

export default router;
