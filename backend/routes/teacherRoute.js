import express from "express";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controllers/teachersController.js";
import { protectedRoute } from "../middlewares/authorization.js";


const router = express.Router();


router.post("/create", protectedRoute ,createTeacher);
router.get("/get", protectedRoute , getAllTeachers);
router.get("/getId/:teacherId", protectedRoute , getTeacherById);
router.put("/update/:teacherId", protectedRoute , updateTeacher);
router.delete("/delete/:teacherId", protectedRoute , deleteTeacher);

export default router;
