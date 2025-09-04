import express from "express";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });
router.post("/", authMiddleware(["admin", "creator", "editor"]), createItem);
router.get("/", authMiddleware(), getItems);
router.put("/:id", authMiddleware(["admin", "editor"]), updateItem);
router.delete("/:id", authMiddleware(["admin"]), deleteItem);

export default router;
