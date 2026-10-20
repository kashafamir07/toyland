import express from "express";
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  validateDiscount,
} from "../controllers/discountController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/validate/:code", protect, validateDiscount);
router.get("/", protect, adminOnly, getDiscounts);
router.post("/", protect, adminOnly, createDiscount);
router.put("/:id", protect, adminOnly, updateDiscount);
router.delete("/:id", protect, adminOnly, deleteDiscount);

export default router;