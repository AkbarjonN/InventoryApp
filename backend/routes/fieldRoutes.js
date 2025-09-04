import express from "express";
import {
  createField,
  getFields,
  deleteField,
} from "../controllers/fieldController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware(["admin", "creator"]), createField);
router.get("/:inventoryId", authMiddleware(), getFields);
router.delete("/:id", authMiddleware(["admin", "creator"]), deleteField);

export default router;
