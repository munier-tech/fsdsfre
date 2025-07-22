import express from "express"
import { changePassword, LogOut, SignIn, SignUp, WhoAmI } from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/authorization.js";
const router = express.Router();




router.post("/signUp", SignUp)
router.post("/login", SignIn)
router.post("/logout", LogOut)
router.get("/WhoAmI", protectedRoute , WhoAmI)
router.post("/changePassword", protectedRoute , changePassword)




export default router;