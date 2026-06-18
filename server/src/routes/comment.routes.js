// server/src/routes/comment.routes.js

import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getGameComments,
  getCommentReplies,
  createComment,
  updateComment,
  deleteComment,
  reactToComment,
  reportComment
} from "../controllers/commentController.js";

const router = express.Router();

//  ALL routes require authentication
// Only logged-in users can see and interact with comments
router.get("/game/:gameId", auth, getGameComments);
router.get("/:commentId/replies", auth, getCommentReplies);
router.post("/", auth, createComment);
router.put("/:commentId", auth, updateComment);
router.delete("/:commentId", auth, deleteComment);
router.post("/:commentId/react", auth, reactToComment);
router.post("/:commentId/report", auth, reportComment);

export default router;