import express from "express";
import { getMatchPreview } from "../controllers/matchPreviewController.js";

const router = express.Router();

router.get("/", getMatchPreview);

export default router;