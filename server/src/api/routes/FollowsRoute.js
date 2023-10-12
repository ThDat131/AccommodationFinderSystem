import { Router } from "express";
import FollowsController from "../controllers/FollowsController.js";
import { verifyToken, verifyUser } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/follows/", verifyToken, FollowsController.follow); // theo dõi người dùng khác
router.delete("/follows/", verifyToken, FollowsController.unFollow); // Bỏ theo dõi người dùng 
// Lấy danh sách "người theo dõi - dat" theo "người bị theo dõi - duc"
router.get("/follows/user/follower/:id", FollowsController.getFollowByFollower); 
// Lấy danh sách người bị theo dõi theo người theo dõi
router.get("/follows/user/following/:id", FollowsController.getFollowByFollowing); 

export default router;