import express from "express";
import { toggleLike, getLikes } from "../controllers/likeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware(), toggleLike);
router.get("/:postId", authMiddleware(), getLikes);

export default router;
