import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
} from "../controllers/postController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router({ mergeParams: true });
router.post("/", authMiddleware(), createPost);
router.get("/", authMiddleware(), getPosts);
router.delete("/:id", authMiddleware(), deletePost);

export default router;
