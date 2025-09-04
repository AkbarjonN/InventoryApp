import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import sequelize from "./config/db.js";
import initModels from "./models/initModels.js";

import authRoutes from "./routes/authRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import fieldRoutes from "./routes/fieldRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import usersRouter from "./routes/users.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();
const app = express();
const httpServer = createServer(app);
const allowedOrigins = [
  "http://localhost:5173",                        
  "https://inventory-app-eight-psi.vercel.app"   
];
const io = new Server(httpServer, {
  cors: {
    origin: "https://inventory-app-eight-psi.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials:true
  },
  path: "/socket.io", 
});
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
const models = initModels(sequelize);
app.use((req, res, next) => {
  req.models = models;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth/users", usersRouter);
app.use("/api/admin", adminRoutes);

(async () => {
  try {
    initModels(sequelize);
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected & synced");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();


io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join_inventory", (inventoryId) => {
    socket.join(`inventory_${inventoryId}`);
    console.log(`📦 User joined inventory_${inventoryId}`);
  });

  socket.on("join_post", (postId) => {
    socket.join(`post_${postId}`);
    console.log(`📝 User joined post_${postId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
