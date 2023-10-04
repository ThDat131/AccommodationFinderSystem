import { Router } from "express";
import CategoriesController from "../controllers/CategoriesController.js";
import { verifyAdmin, verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/categories/create/", verifyAdmin, CategoriesController.create); // Tạo một loại chuyên mục
router.get("/categories/", CategoriesController.getAllCategory); // lấy danh sách các chuyên mục
router.delete("/categories/:id", verifyAdmin, CategoriesController.delete); // xoá một chuyên mục
router.get("/categories/:id", CategoriesController.getCategoryById); // lấy chuyên mục theo Id

export default router;
