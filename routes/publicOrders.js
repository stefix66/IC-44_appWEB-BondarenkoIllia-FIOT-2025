// routes/publicOrders.js

import express from "express";
import { createPublicOrder } from "../controllers/publicOrdersController.js";

const router = express.Router();

// Публічний endpoint для оформлення замовлення з головної сторінки
router.post("/", createPublicOrder);

export default router;
