import { Router } from "express";
import {verifyToken, verifyUser} from "../middlewares/verifyToken.js"
import CommentsController from "../controllers/CommentsController.js";

const router = Router();

router.post("/comments/", verifyToken, CommentsController.create); // Tạo bình luận cho bài viết
router.get("/comments/:postId", CommentsController.getAll); // Lấy tất cả bình luận theo id bài viết (post)
router.put("/comments/:id", verifyToken, CommentsController.edit); // Chỉnh sửa bình luận
router.delete("/comments/:id", verifyToken, CommentsController.delete); // Xoá bình luận

export default  router;