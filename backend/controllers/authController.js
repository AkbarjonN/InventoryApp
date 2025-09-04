
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sequelize from "../config/db.js";
import initModels from "../models/initModels.js";
import { Op } from "sequelize";

dotenv.config();
const { User } = initModels(sequelize);
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);n
    const userCount = await User.count();
    const role = userCount === 0 ? "admin" : "creator";

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({ message: "User registered", user });
  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "inventory_key",
      { expiresIn: "1d" }
    );

    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Error logging in" });
  }
};

export const updateRole = async (req, res) => {
  const { userId, newRole } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update roles" });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = newRole;
    await user.save();

    return res.json({ message: "Role updated", user });
  } catch (error) {
    console.error("❌ Update role error:", error);
    return res.status(500).json({ message: "Error updating role" });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can view users" });
    }
    const users = await User.findAll({
      attributes: ["id", "username", "email", "role"],
    });
    return res.json(users);
  } catch (error) {
    console.error("❌ Get users error:", error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};
