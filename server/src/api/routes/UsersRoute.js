import { Router } from "express";
import UsersController from "../controllers/UsersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/signup", UsersController.signup);
router.post("/signin", UsersController.signin);
router.get("/users/:id", verifyToken, UsersController.getUser);
router.get("/users", verifyToken, UsersController.getAllUser);
router.put("/users/:id/updateUser", verifyToken, UsersController.updateUser);

export default router;
