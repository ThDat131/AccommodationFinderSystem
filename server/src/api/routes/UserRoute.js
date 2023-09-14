import { Router } from "express"; 
import UserController from "../controllers/UserController.js";


const route = Router();

route.post("/signup", UserController.signup);

export default route;