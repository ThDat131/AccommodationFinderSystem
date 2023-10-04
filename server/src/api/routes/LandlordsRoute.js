import { Router } from "express";
import LandlordsController from "../controllers/LanlordsController.js";
import { verifyAdmin, verifyToken } from "../middlewares/verifyToken.js";
import { uploadCloud } from "../../config/cloudinary/index.js";

const router = Router();

router.post("/landlord/create", verifyToken, uploadCloud.array('images'), LandlordsController.create);
router.put("/landlord/:id/update/", verifyAdmin, LandlordsController.update);

export default router;