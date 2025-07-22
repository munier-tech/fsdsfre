import express from "express";
import {
  AddFinance,
  getAllFinance,
  getFinanceById,
} from "../controllers/financeController.js";

const router = express.Router();

router.post("/create", AddFinance);
router.get("/getAll", getAllFinance);
router.get("/get/:financeId", getFinanceById);

export default router;
