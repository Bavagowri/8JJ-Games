// server/src/app.js


import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);

export default app;