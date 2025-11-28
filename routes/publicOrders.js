// routes/publicOrders.js
import express from "express";
import { createPublicOrder } from "../controllers/publicOrdersController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Тепер тільки авторизований користувач може створити замовлення
router.post("/", verifyToken, createPublicOrder);

export default router;
