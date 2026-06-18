// server/src/routes/prediction.routes.js
import express from "express";
import { submitPrediction, getMyPredictions, getMatchSubmissions, getPredictionLeaderboard, getPredictionOverview } from "../controllers/prediction.controller.js";
import { auth } from "../middleware/auth.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/predict",           auth,      submitPrediction);
router.get("/my",                 auth,      getMyPredictions);
router.get("/match/:matchId",     adminAuth, getMatchSubmissions);
router.get("/leaderboard", getPredictionLeaderboard);
router.get("/overview", getPredictionOverview)

export default router;