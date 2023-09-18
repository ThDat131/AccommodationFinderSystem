import { Router } from "express";
import UsersController from "../controllers/UsersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/signup", UsersController.signup);
router.post("/signin", UsersController.signin);
router.get("/users/:id", UsersController.getUser);
router.get("/getCurrentUser", UsersController.getCurrentUser);
router.get("/users", UsersController.getAllUser);
router.put("/users/:id/updateUser", UsersController.updateUser);

export default router;
