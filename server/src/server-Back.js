// // server/src/server.js - FIXED VERSION
// import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // DEFINE envFile HERE
// const envFile =
//   process.env.NODE_ENV === "local"
//     ? path.resolve(__dirname, "../.env.local")
//     : path.resolve(__dirname, "../.env");

// // const envFile = path.resolve(__dirname, "../.env");

// // LOAD ENV ONCE
// dotenv.config({ path: envFile });

// console.log("🌍 ENV:", process.env.NODE_ENV);
// console.log("🗄️ DB USER:", process.env.DB_USER);
// console.log("🗄️ DB NAME:", process.env.DB_NAME);

// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.js";
// import adminRoutes from "./routes/admin.js";
// import proxyRoutes from "./routes/proxy.routes.js";
// import profileRoutes from "./routes/profile.js";
// import activityRoutes from "./routes/activity.routes.js";
// import collectionRoutes from "./routes/collection.routes.js";
// import redemptionRoutes from "./routes/redemption.js";
// import notificationRoutes from "./routes/notification.routes.js";
// import commentRoutes from "./routes/comment.routes.js"; 
// import leaderboardRoute from "./routes/leaderboard.routes.js";
// import { createServer } from "http";
// import adminPointsRoutes from "./routes/admin.points.routes.js";
// import gamesRoutes from "./routes/games.routes.js";
// import cron from "node-cron";
// import { syncH5Games } from "./services/syncH5Games.js";
// import adminSyncRoutes from "./routes/adminSync.routes.js";
// import adminGameRoutes from "./routes/admin.games.routes.js";


// // import { initializeSocket } from "./socket/chatSocket.js";
// // import chatAdminRoutes from "./routes/chatAdmin.routes.js"; 
// // import chatRoutes from "./routes/chat.routes.js"; 
// import bannerRoutes from "./routes/banner.routes.js";

// const app = express();
// app.set("trust proxy", 1);
// /* ================= CORS ================= */
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }),
// );

// /* ================= MIDDLEWARE ================= */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// /* ================= STATIC FILES - Serve uploaded avatars ================= */
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// cron.schedule("0 */6 * * *", () => {
//   console.log("Running H5 sync...");
//   syncH5Games();
// });

// // app.use(
// //   "/uploads",
// //   express.static(path.join(process.cwd(), "uploads"))
// // );

// /* ================= REQUEST LOGGING (for debugging) ================= */
// app.use((req, res, next) => {
//   console.log(`📥 ${req.method} ${req.path}`);
//   next();
// });

// app.set("etag", false);

// //  Create HTTP server BEFORE routes
// const server = createServer(app);

// //  Initialize Socket.io
// // initializeSocket(server);

// /* ================= ROUTES ================= */
// //  Register ALL routes BEFORE 404 handler
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/proxy", proxyRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/collection", collectionRoutes);
// app.use("/api/activity", activityRoutes);
// app.use("/api/redemption", redemptionRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/comments", commentRoutes); 
// app.use("/api/leaderboard", leaderboardRoute);
// app.use("/api/games", gamesRoutes);

// app.use("/api/admin/points", adminPointsRoutes);
// app.use("/api/admin", adminSyncRoutes);
// app.use("/api/admin/games", adminGameRoutes);


// // app.use("/api/chat-admin", chatAdminRoutes); 
// // app.use("/api/chat", chatRoutes); // NEW CHAT WITH ADMIN
// app.use("/api/banners", bannerRoutes);

// // Health check
// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// /* ================= 404 HANDLER ================= */
// // Must be AFTER all routes
// app.use((req, res) => {
//   console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
//   res.status(404).json({ message: "Route not found" });
// });

// /* ================= ERROR HANDLER ================= */
// //  Must be LAST
// app.use((err, req, res, next) => {
//   console.error("❌ Server Error:", err);

//   // Handle multer errors
//   if (err.code === 'LIMIT_FILE_SIZE') {
//     return res.status(400).json({ message: "File size too large. Maximum 5MB allowed." });
//   }

//   if (err.message === 'Only image files are allowed') {
//     return res.status(400).json({ message: err.message });
//   }

//   res.status(500).json({
//     message: "Internal server error",
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// /* ================= START SERVER ================= */
// const PORT = process.env.PORT;
// console.log("🌍 ENV:", process.env.NODE_ENV);
// console.log("🔗 FRONTEND_URL:", process.env.FRONTEND_URL);

// // Use ONLY server.listen (NOT app.listen)
// // server.listen includes both Express and Socket.io
// server.listen(PORT, () => {
//   console.log(`✅ Backend running on http://localhost:${PORT}`);
//   console.log(`🔌 Socket.io ready for connections`);
//   console.log(`📊 Admin routes: http://localhost:${PORT}/api/admin/*`);
//   console.log(`👤 Profile routes: http://localhost:${PORT}/api/profile/*`);
//   console.log(`🔔 Notification routes: http://localhost:${PORT}/api/notifications/*`);
//   console.log(`💬 Comment routes: http://localhost:${PORT}/api/comments/*`);
//   // console.log(`💬 Chat routes: http://localhost:${PORT}/api/chat/*`); 
//   // console.log(`💬 Chat Admin routes: http://localhost:${PORT}/api/chat-admin/*`); 
//   console.log(`📁 Uploads served at: http://localhost:${PORT}/uploads/*`);
  
// });