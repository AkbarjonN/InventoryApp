import express from "express";
import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controllers/inventoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import itemRoutes from "./itemRoutes.js";

const router = express.Router();
router.post("/", authMiddleware(["admin", "creator"]), createInventory);
router.get("/", authMiddleware(), getInventories);
router.get("/:id", authMiddleware(), getInventoryById);
router.put("/:id", authMiddleware(["admin", "creator"]), updateInventory);
router.delete("/:id", authMiddleware(["admin"]), deleteInventory);
router.use("/:inventoryId/items", itemRoutes);

export default router;
