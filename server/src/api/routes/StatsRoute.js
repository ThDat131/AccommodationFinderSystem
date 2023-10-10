import { Router } from "express";
import StatsController from "../controllers/StatsController.js";

const router = Router();
// thống kê bài viết của chủ trọ. id truyển trên đường dẫn là id của người dùng có vai trò landlord
router.get("/landlords/:id/stats", StatsController.getStatsOfPost); 

export default router;
