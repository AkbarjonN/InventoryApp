import express from "express";
import { register, login, updateRole, getUsers  } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware(["admin"]), getUsers);
router.put("/role", authMiddleware(["admin"]), updateRole);

const FRONTEND_URL = process.env.FRONTEND_URL;

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?err=google` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"], session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: `${FRONTEND_URL}/login?err=github` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);
export default router;
