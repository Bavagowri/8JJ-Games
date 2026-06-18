// proxy-server/src/server.js
import express from "express";
import cors from "cors";
import proxyRoutes from "./routes/proxy.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", proxyRoutes);

const PORT = 5175;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
