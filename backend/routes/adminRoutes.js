import express from "express";
import sequelize from "../config/db.js";
import initModels from "../models/initModels.js";

const { User } = initModels(sequelize);
const router = express.Router();


function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

router.get("/users", isAdmin, async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "username", "email", "role"] });
  res.json(users);
});

router.put("/users/:id/make-admin", isAdmin, async (req, res) => {
  await User.update({ role: "admin" }, { where: { id: req.params.id } });
  res.json({ message: "User promoted to admin" });
});

router.put("/users/:id/remove-admin", isAdmin, async (req, res) => {
  await User.update({ role: "creator" }, { where: { id: req.params.id } });
  res.json({ message: "Admin removed" });
});

export default router;
