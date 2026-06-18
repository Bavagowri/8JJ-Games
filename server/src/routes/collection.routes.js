// server/src/routes/collection.routes.js



import express from "express";
import { addToCollection, getMyCollection, removeFromCollection } from "../controllers/collectionController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/collection
router.get("/", auth, getMyCollection);

// POST /api/collection
router.post("/", auth, addToCollection);

// DELETE /api/collection/:gameId
router.delete("/:gameId", auth, removeFromCollection);

export default router;
