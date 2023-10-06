import { Router } from "express";
import LandlordsController from "../controllers/LanlordsController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../middlewares/verifyToken.js";
import { uploadCloud } from "../../config/cloudinary/index.js";

const router = Router();

router.post("/landlords/create/", verifyUser, uploadCloud.array('images'), LandlordsController.create); // Đăng ký chủ trọ
router.put("/landlords/:id/update/", verifyAdmin, LandlordsController.update); // Duyệt thông tin chủ trọ
router.get("/landlords/", verifyAdmin, LandlordsController.getAll); // Lấy danh sách dựa trên active

export default router;