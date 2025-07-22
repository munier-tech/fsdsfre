import express from "express"
import { createAttendance, deleteAttendance, getClassAttendanceByDate, updateAttendance } from "../controllers/attendanceController.js";
const router = express.Router();



router.post("/create", createAttendance);
router.get("/get/:classId/:date", getClassAttendanceByDate);
router.put("/update/:attendanceId", updateAttendance);
router.delete("/delete/:attendanceId", deleteAttendance);




export default router;