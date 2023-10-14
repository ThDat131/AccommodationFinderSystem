import { Router } from "express";
import AuthsController from "../controllers/AuthsController.js";

const router = Router();
router.post("/confirmCode", AuthsController.confirmCode); // Xác nhận mã
router.post("/signup", AuthsController.signup); // Đăng ký
router.post("/signin", AuthsController.signin); // Đăng nhập
router.post("/signin/facebook", AuthsController.signinWithFacebook); // Đăng nhập
// router.get("/auth/facebook", AuthsController.authenticateFacebook); // đăng nhập với FB
// router.get("/auth/facebook/callback", AuthsController.callbackFacebook); // đăng nhập với FB
// router.get("/auth/logout", AuthsController.logout); // đăng nhập với FB
export default router;
