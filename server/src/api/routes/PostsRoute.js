import { Router } from "express";
import PostsController from "../controllers/PostsController.js";
import { uploadCloud } from "../../config/cloudinary/index.js";
import { verifyLandlord, verifyToken } from "../middlewares/verifyToken.js";


const router = Router();

router.post("/posts/create/", verifyToken, uploadCloud.array("images"), PostsController.create); // tạo bài viết
router.get("/posts/", PostsController.getAllPost); // Lấy tất cả bài viết
router.get("/posts/:id", PostsController.getPost); // Lấy chi tiết một bài viết dựa trên id
router.get("/posts/manage/:id", verifyToken, PostsController.getAllPostByUserId) // Lấy danh sách bài viết dựa trên id của người dùng
router.delete("/posts/:id", verifyToken, PostsController.delete);

export default router;