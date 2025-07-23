import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  assignStudentToClass,
  getClassAttendance,
  getClassStudents
} from "../controllers/classController.js";
import { protectedRoute } from "../middlewares/authorization.js";

const router = express.Router();

router.post("/create", protectedRoute ,createClass);
router.get("/getAll", protectedRoute ,getAllClasses);
router.get("/getId/:classId", protectedRoute ,getClassById);
router.put("/update/:classId", protectedRoute ,updateClass);
router.delete("/delete/:classId", protectedRoute ,deleteClass);
router.post("/:studentId/:classId", protectedRoute ,assignStudentToClass);
router.get("/getAttendance/:classId", protectedRoute , getClassAttendance);
router.get("/getStudents/:classId", protectedRoute , getClassStudents);

export default router;
