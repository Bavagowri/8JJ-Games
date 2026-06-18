import express from "express";
import { proxyRequest } from "../controllers/proxy.controller.js";

const router = express.Router();

router.get("/proxy", proxyRequest);

export default router;
