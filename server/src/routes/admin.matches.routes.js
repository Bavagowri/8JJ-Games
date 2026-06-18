// ─── server/src/routes/admin.matches.routes.js ───────────────────────────────
import express from "express";
import {
  adminSyncMatches,
  getFixtures,
  getAdminMatches,
  createPredictionMatch,
  setMatchWinner,
  lockPredictionMatch,
  unlockMatchPredictions,
  toggleFeaturedMatch,
  deletePredictionMatch,
  editPredictionMatch,
  getMatchDetails
} from "../controllers/adminMatches.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();
router.use(adminAuth);

router.post("/sync-matches",           adminSyncMatches);
router.get("/fixtures",        getFixtures);
router.get("/",                getAdminMatches);
router.get("/:id",               getMatchDetails);
router.post("/create",         createPredictionMatch);
router.put("/:id",               editPredictionMatch)               // update
router.post("/:id/winner",     setMatchWinner);
router.post("/:id/lock",       lockPredictionMatch);  
router.post("/:id/unlock", unlockMatchPredictions);
router.post("/:id/feature", toggleFeaturedMatch);
router.delete("/:id", deletePredictionMatch);

export default router;