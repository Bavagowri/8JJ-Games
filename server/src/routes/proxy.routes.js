// server/src/routes/proxy.routes.js
import express from "express";
import { proxyRequest } from "../controllers/proxy.controller.js";

const router = express.Router();

/**
 * GET /api/proxy?url=https://example.com/file
 */
router.get("/", proxyRequest);

export default router;
