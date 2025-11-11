// routes/users.js
import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = express.Router();

// /api/users
router.get("/", getUsers);        // READ all
router.get("/:id", getUserById);  // READ one
router.post("/", createUser);     // CREATE
router.put("/:id", updateUser);   // UPDATE
router.delete("/:id", deleteUser);// DELETE

export default router;
