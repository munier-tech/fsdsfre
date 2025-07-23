import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDb } from "./lib/database.js"
import AuthRouter from "./routes/authRoute.js"
import TeacherRouter from "./routes/teacherRoute.js"
import StudentsRouter from "./routes/studentsRoute.js"
import attendanceRouter from "./routes/attendanceRoute.js"
import classRouter from "./routes/classRoute.js"
import healthRouter from "./routes/healthRouter.js"
import cookieParser from "cookie-parser";
dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}))
app.use(express.json())
app.use(cookieParser()); // ✅ This makes req.cookies available
app.use(express.urlencoded({ extended: true }))




app.use("/api/auth", AuthRouter);
app.use("/api/teachers", TeacherRouter);
app.use("/api/students", StudentsRouter);
app.use("/api/classes", classRouter);
app.use("/api/attendance", attendanceRouter);
  app.use("/api/health", healthRouter);





app.listen(PORT , () => {
  console.log(`Server is running on port  ${PORT}`);

  connectDb().then(() => {
    console.log("Connected to PostgreSQL successfully");
  }).catch(err => {
    console.error("Failed to connect to PostgreSQL:", err);
  });
})