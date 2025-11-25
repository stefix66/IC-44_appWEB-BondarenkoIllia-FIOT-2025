// routes/orders.js
import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", getOrders);        // GET    /api/orders
router.get("/:id", getOrderById);  // GET    /api/orders/:id
router.post("/", createOrder);     // POST   /api/orders
router.put("/:id", updateOrder);   // PUT    /api/orders/:id
router.delete("/:id", deleteOrder);// DELETE /api/orders/:id

export default router;
