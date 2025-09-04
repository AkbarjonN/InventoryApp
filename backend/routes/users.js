
import express from "express";
import sequelize from "../config/db.js";  // ✅ DB connection
import initModels from "../models/initModels.js";
import { authenticate, requireRole } from "../middleware/authMiddleware.js";
const router = express.Router();
const { User } = initModels(sequelize);
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role"]
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Users fetch error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

export default router;
