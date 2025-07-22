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

const router = express.Router();

router.post("/create", createClass);
router.get("/getAll", getAllClasses);
router.get("/getId/:classId", getClassById);
router.put("/update/:classId", updateClass);
router.delete("/delete/:classId", deleteClass);
router.post("/:studentId/:classId", assignStudentToClass);
router.get("/getAttendance/:classId", getClassAttendance);
router.get("/getStudents/:classId", getClassStudents);

export default router;
