import express from "express";
import {
  setFieldValue,
  getItemFieldValues,
} from "../controllers/fieldValueController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware(["admin", "creator", "editor"]), setFieldValue);
router.get("/:itemId", authMiddleware(), getItemFieldValues);

export default router;
