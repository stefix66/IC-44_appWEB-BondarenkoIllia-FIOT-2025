// routes/promotions.js
import express from "express";
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotionsController.js";

const router = express.Router();

router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.post("/", createPromotion);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;
