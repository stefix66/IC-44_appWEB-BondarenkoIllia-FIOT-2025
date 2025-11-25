// routes/menuitems.js
import express from "express";
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuItemsController.js";

const router = express.Router();

router.get("/", getMenuItems);        // GET    /api/menuitems
router.get("/:id", getMenuItemById);  // GET    /api/menuitems/:id
router.post("/", createMenuItem);     // POST   /api/menuitems
router.put("/:id", updateMenuItem);   // PUT    /api/menuitems/:id
router.delete("/:id", deleteMenuItem);// DELETE /api/menuitems/:id

export default router;
