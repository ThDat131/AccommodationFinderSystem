import { Router } from "express";
import {verifyEditComment, verifyEditReplyComment, verifyToken, verifyUser} from "../middlewares/verifyToken.js"
import CommentsController from "../controllers/CommentsController.js";

const router = Router();

router.post("/comments/", verifyToken, CommentsController.create); // Tạo bình luận cho bài viết
router.put("/comments/:id/reply", verifyToken, CommentsController.reply); // Phản hồi bình luận
router.get("/comments/:postId", CommentsController.getAll); // Lấy tất cả bình luận theo id bài viết (post)
router.put("/comments/:id", verifyEditComment, CommentsController.edit); // Chỉnh sửa bình luận
router.put("/comments/:id/replies/:replyId", verifyEditReplyComment, CommentsController.editReply); // Chỉnh sửa phản hồi bình luận
router.delete("/comments/:id", verifyEditComment, CommentsController.delete); // Xoá bình luận
router.delete("/comments/:id/replies/:replyId", verifyEditReplyComment, CommentsController.deleteReply); // Xoá phản hồi

export default  router;