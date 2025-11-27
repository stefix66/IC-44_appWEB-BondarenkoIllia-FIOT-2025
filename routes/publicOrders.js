// routes/publicOrders.js

import express from "express";
import { createPublicOrder } from "../controllers/publicOrdersController.js";

const router = express.Router();


router.post("/", createPublicOrder);

export default router;
