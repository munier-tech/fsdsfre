import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  assignStudentToClass,
  trackFeePayment,
  getFeeStatus,
  updateFeeInfo,
  deleteFeeInfo
} from "../controllers/studentsController.js";

const router = express.Router();

// Core student routes
router.post("/create", createStudent);
router.get("/getAll", getAllStudents);
router.get("/getId/:studentId", getStudentById);
router.put("/update/:studentId", updateStudent);
router.delete("/delete/:studentId", deleteStudent);

// Class assignment
router.post("/:studentId/:classId", assignStudentToClass);

// Fee management (🟡 made consistent by placing studentId at end)
router.patch("/track-fee/:studentId", trackFeePayment);      
router.get("/fee-status/:studentId", getFeeStatus);          
router.patch("/update-fee/:studentId", updateFeeInfo);       
router.delete("/reset-fee/:studentId", deleteFeeInfo);       

export default router;
