import express from "express";
import { getMatches, getMatchDetails } from "../controllers/matches.controller.js";

const router = express.Router();

router.get("/", getMatches);

router.get("/:id", getMatchDetails)

export default router;