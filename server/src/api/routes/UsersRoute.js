import { Router } from "express";
import UsersController from "../controllers/UsersController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { uploadCloud } from "../../config/cloudinary/index.js";

const router = Router();

router.post("/confirmCode", UsersController.confirmCode); // Xác nhận mã
router.post("/signup", UsersController.signup); // Đăng ký
router.post("/signin", UsersController.signin); // Đăng nhập
router.get("/getCurrentUser", UsersController.getCurrentUser); // Lấy người dùng qua token
router.get("/users/", UsersController.getAllUser); // Lấy tất cả người dùng
router.get("/users/:id", UsersController.getUser); // Lấy thông tin chi tiết người dùng
router.put(
  "/users/:id/updateUser",
  uploadCloud.single("avatar"),
  UsersController.updateUser
); // Cập nhật thông tin
router.delete("/users/:id", UsersController.deleteUser); // Xoá mềm
router.delete("/users/:id/force", UsersController.destroyUser); // Xoá vĩnh viễn
router.get("/users/trash/list", UsersController.trashUsers); // lấy danh sách đã xoá
router.patch("/users/:id/restore", UsersController.restoreUser); // khôi phục


export default router;
