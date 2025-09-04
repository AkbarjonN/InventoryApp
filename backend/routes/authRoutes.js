
import express from "express";
import { register, login, updateRole, getUsers  } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware(["admin"]), getUsers);

router.put("/role", authMiddleware(["admin"]), updateRole);

export default router;
