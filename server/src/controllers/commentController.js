
// // server/src/controllers/commentController.js - FIXED VERSION
// // All routes require authentication, so req.user should always be present

// import { db } from "../db/index.js";
// import { createNotification } from "./notificationController.js";

// /* ================= GET COMMENTS FOR A GAME ================= */
// export async function getGameComments(req, res) {
//   try {
//     const { gameId } = req.params;
//     const {
//       sort = 'newest',
//       limit = 20,
//       offset = 0
//     } = req.query;

//     //  DEFENSIVE CHECK with detailed logging
//     console.log("🔍 Auth check:", {
//       hasUser: !!req.user,
//       userId: req.user?.id,
//       userObject: req.user
//     });

//     if (!req.user || !req.user.id) {
//       console.error("❌ Missing req.user or req.user.id");
//       return res.status(401).json({ 
//         message: "Authentication required" 
//       });
//     }

//     const userId = req.user.id;

//     let orderBy;

//     // Determine sort order
//     if (sort === 'popular') {
//       orderBy = 'gc.like_count DESC, gc.created_at DESC';
//     } else if (sort === 'oldest') {
//       orderBy = 'gc.created_at ASC';
//     } else {
//       orderBy = 'gc.created_at DESC';
//     }

//     const query = `
//       SELECT 
//         gc.id,
//         gc.game_id,
//         gc.content,
//         gc.is_edited,
//         gc.edited_at,
//         gc.like_count,
//         gc.reply_count,
//         gc.created_at,
//         gc.parent_comment_id,
        
//         u.id as user_id,
//         u.username,
//         u.avatar,
//         u.level,
//         u.tier,
//         u.role,
        
//         cr.reaction_type as user_reaction
        
//       FROM game_comments gc
//       INNER JOIN users u ON gc.user_id = u.id
//       LEFT JOIN comment_reactions cr ON cr.comment_id = gc.id AND cr.user_id = ?
//       WHERE gc.game_id = ?
//         AND gc.parent_comment_id IS NULL
//         AND gc.is_deleted = FALSE
//         AND gc.is_approved = TRUE
//       ORDER BY ${orderBy}
//       LIMIT ? OFFSET ?
//     `;

//     const params = [userId, gameId, parseInt(limit), parseInt(offset)];

//     console.log("📝 Query params:", params); // Debug log

//     const [comments] = await db.execute(query, params);

//     // Get total count
//     const [[{ total }]] = await db.execute(
//       `SELECT COUNT(*) as total 
//        FROM game_comments 
//        WHERE game_id = ? 
//          AND parent_comment_id IS NULL 
//          AND is_deleted = FALSE 
//          AND is_approved = TRUE`,
//       [gameId]
//     );

//     res.json({
//       comments,
//       pagination: {
//         total,
//         limit: parseInt(limit),
//         offset: parseInt(offset),
//         hasMore: (parseInt(offset) + comments.length) < total
//       }
//     });

//   } catch (err) {
//     console.error("❌ GET COMMENTS ERROR:", err);
//     res.status(500).json({
//       message: "Failed to fetch comments",
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// }

// /* ================= GET REPLIES FOR A COMMENT ================= */
// export async function getCommentReplies(req, res) {
//   try {
//     const { commentId } = req.params;

//     //  DEFENSIVE CHECK
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const userId = req.user.id;

//     const query = `
//       SELECT 
//         gc.id,
//         gc.content,
//         gc.is_edited,
//         gc.edited_at,
//         gc.like_count,
//         gc.created_at,
//         gc.parent_comment_id,
        
//         u.id as user_id,
//         u.username,
//         u.avatar,
//         u.level,
//         u.tier,
//         u.role,
        
//         cr.reaction_type as user_reaction
        
//       FROM game_comments gc
//       INNER JOIN users u ON gc.user_id = u.id
//       LEFT JOIN comment_reactions cr ON cr.comment_id = gc.id AND cr.user_id = ?
//       WHERE gc.parent_comment_id = ?
//         AND gc.is_deleted = FALSE
//         AND gc.is_approved = TRUE
//       ORDER BY gc.created_at ASC
//     `;

//     const [replies] = await db.execute(query, [userId, commentId]);
//     res.json(replies);

//   } catch (err) {
//     console.error("GET REPLIES ERROR:", err);
//     res.status(500).json({ message: "Failed to fetch replies" });
//   }
// }

// /* ================= POST NEW COMMENT ================= */
// export async function createComment(req, res) {
//   try {
//     //  DEFENSIVE CHECK
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const userId = req.user.id;
//     const { gameId, content, parentCommentId = null } = req.body;

//     if (!content || content.trim().length < 2) {
//       return res.status(400).json({ message: "Comment too short" });
//     }

//     if (content.length > 1000) {
//       return res.status(400).json({ message: "Comment too long (max 1000 characters)" });
//     }

//     const profanityWords = ['badword1', 'badword2'];
//     const lowerContent = content.toLowerCase();
//     const hasProfanity = profanityWords.some(word => lowerContent.includes(word));
//     const moderationStatus = hasProfanity ? 'pending' : 'approved';

//     const [result] = await db.execute(
//       `INSERT INTO game_comments 
//        (game_id, user_id, parent_comment_id, content, moderation_status, is_approved)
//        VALUES (?, ?, ?, ?, ?, ?)`,
//       [gameId, userId, parentCommentId, content, moderationStatus, !hasProfanity]
//     );

//     const commentId = result.insertId;

//     if (parentCommentId) {
//       await db.execute(
//         'UPDATE game_comments SET reply_count = reply_count + 1 WHERE id = ?',
//         [parentCommentId]
//       );

//       const [[parentComment]] = await db.execute(
//         'SELECT user_id FROM game_comments WHERE id = ?',
//         [parentCommentId]
//       );

//       if (parentComment && parentComment.user_id !== userId) {
//         await createNotification({
//           userId: parentComment.user_id,
//           type: 'comment_reply',
//           title: 'New Reply to Your Comment',
//           message: `${req.user.username} replied to your comment`,
//           actionUrl: `/game/${gameId}?comment=${commentId}`,
//           actionText: 'View Reply',
//           priority: 'normal'
//         });
//       }
//     }

//     const [[newComment]] = await db.execute(
//       `SELECT gc.*, u.username, u.avatar, u.level, u.tier, u.role
//        FROM game_comments gc
//        INNER JOIN users u ON gc.user_id = u.id
//        WHERE gc.id = ?`,
//       [commentId]
//     );

//     res.status(201).json({
//       message: hasProfanity ? "Comment submitted for moderation" : "Comment posted successfully",
//       comment: newComment
//     });

//   } catch (err) {
//     console.error("CREATE COMMENT ERROR:", err);
//     res.status(500).json({ message: "Failed to post comment" });
//   }
// }

// /* ================= UPDATE COMMENT ================= */
// export async function updateComment(req, res) {
//   try {
//     //  DEFENSIVE CHECK
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const userId = req.user.id;
//     const { commentId } = req.params;
//     const { content } = req.body;

//     if (!content || content.trim().length < 2) {
//       return res.status(400).json({ message: "Comment too short" });
//     }

//     const [[comment]] = await db.execute(
//       'SELECT user_id FROM game_comments WHERE id = ?',
//       [commentId]
//     );

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     if (comment.user_id !== userId && req.user.role !== 'admin') {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await db.execute(
//       'UPDATE game_comments SET content = ?, is_edited = TRUE, edited_at = NOW() WHERE id = ?',
//       [content, commentId]
//     );

//     res.json({ message: "Comment updated successfully" });

//   } catch (err) {
//     console.error("UPDATE COMMENT ERROR:", err);
//     res.status(500).json({ message: "Failed to update comment" });
//   }
// }

// /* ================= DELETE COMMENT ================= */
// export async function deleteComment(req, res) {
//   try {
//     //  DEFENSIVE CHECK
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const userId = req.user.id;
//     const { commentId } = req.params;

//     const [[comment]] = await db.execute(
//       'SELECT user_id, parent_comment_id FROM game_comments WHERE id = ?',
//       [commentId]
//     );

//     if (!comment) {
//       return res.status(404).json({ message: "Comment not found" });
//     }

//     if (comment.user_id !== userId && req.user.role !== 'admin') {
//       return res.status(403).json({ message: "Not authorized" });
//     }

//     await db.execute(
//       'UPDATE game_comments SET is_deleted = TRUE WHERE id = ?',
//       [commentId]
//     );

//     if (comment.parent_comment_id) {
//       await db.execute(
//         'UPDATE game_comments SET reply_count = reply_count - 1 WHERE id = ?',
//         [comment.parent_comment_id]
//       );
//     }

//     res.json({ message: "Comment deleted successfully" });

//   } catch (err) {
//     console.error("DELETE COMMENT ERROR:", err);
//     res.status(500).json({ message: "Failed to delete comment" });
//   }
// }

// /* ================= REACT TO COMMENT ================= */
// export async function reactToComment(req, res) {
//   try {
//     //  DEFENSIVE CHECK
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const userId = req.user.id;
//     const { commentId } = req.params;
//     const { reactionType } = req.body;

//     const validReactions = ['like', 'helpful', 'funny', 'love'];
//     if (!validReactions.includes(reactionType)) {
//       return res.status(400).json({ message: "Invalid reaction type" });
//     }

//     const [[existing]] = await db.execute(
//       'SELECT id FROM comment_reactions WHERE user_id = ? AND comment_id = ? AND reaction_type = ?',
//       [userId, commentId, reactionType]
//     );

//     if (existing) {
//       await db.execute('DELETE FROM comment_reactions WHERE id = ?', [existing.id]);
//       await db.execute('UPDATE game_comments SET like_count = like_count - 1 WHERE id = ?', [commentId]);
//       return res.json({ message: "Reaction removed", action: 'removed' });
//     }

//     await db.execute(
//       'INSERT INTO comment_reactions (user_id, comment_id, reaction_type) VALUES (?, ?, ?)',
//       [userId, commentId, reactionType]
//     );

//     await db.execute(
//       'UPDATE game_comments SET like_count = like_count + 1 WHERE id = ?',
//       [commentId]
//     );

//     res.json({ message: "Reaction added", action: 'added' });

//   } catch (err) {
//     console.error("REACT TO COMMENT ERROR:", err);
//     res.status(500).json({ message: "Failed to react" });
//   }
// }

// /* ================= REPORT COMMENT ================= */
// export async function reportComment(req, res) {
//   try {
//     //  DEFENSIVE CHECK
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     const userId = req.user.id;
//     const { commentId } = req.params;
//     const { reason, description } = req.body;

//     const validReasons = ['spam', 'offensive', 'harassment', 'inappropriate', 'other'];
//     if (!validReasons.includes(reason)) {
//       return res.status(400).json({ message: "Invalid report reason" });
//     }

//     const [[existing]] = await db.execute(
//       'SELECT id FROM comment_reports WHERE comment_id = ? AND reported_by = ?',
//       [commentId, userId]
//     );

//     if (existing) {
//       return res.status(400).json({ message: "You already reported this comment" });
//     }

//     await db.execute(
//       'INSERT INTO comment_reports (comment_id, reported_by, reason, description) VALUES (?, ?, ?, ?)',
//       [commentId, userId, reason, description]
//     );

//     const [[{ report_count }]] = await db.execute(
//       'SELECT COUNT(*) as report_count FROM comment_reports WHERE comment_id = ?',
//       [commentId]
//     );

//     if (report_count >= 3) {
//       await db.execute(
//         'UPDATE game_comments SET is_flagged = TRUE WHERE id = ?',
//         [commentId]
//       );
//     }

//     res.json({ message: "Report submitted successfully" });

//   } catch (err) {
//     console.error("REPORT COMMENT ERROR:", err);
//     res.status(500).json({ message: "Failed to submit report" });
//   }
// }


// server/src/controllers/commentController.js - FIXED VERSION
// Changed FALSE/TRUE to 0/1 for mysql2 compatibility

import { db } from "../db/index.js";
import { createNotification } from "./notificationController.js";

/* ================= GET COMMENTS FOR A GAME ================= */
export async function getGameComments(req, res) {
  try {
    const { gameId } = req.params;
    const {
      sort = 'newest',
      limit = 20,
      offset = 0
    } = req.query;

    //  DEFENSIVE CHECK with detailed logging
    // console.log("🔍 Auth check:", {
    //   hasUser: !!req.user,
    //   userId: req.user?.id,
    //   userObject: req.user
    // });

    if (!req.user || !req.user.id) {
      // console.error("❌ Missing req.user or req.user.id");
      return res.status(401).json({ 
        message: "Authentication required" 
      });
    }

    const userId = req.user.id;

    let orderBy;

    // Determine sort order
    if (sort === 'popular') {
      orderBy = 'gc.like_count DESC, gc.created_at DESC';
    } else if (sort === 'oldest') {
      orderBy = 'gc.created_at ASC';
    } else {
      orderBy = 'gc.created_at DESC';
    }

    //  FIXED: Changed FALSE/TRUE to 0/1 for mysql2 compatibility
    const query = `
      SELECT 
        gc.id,
        gc.game_id,
        gc.content,
        gc.is_edited,
        gc.edited_at,
        gc.like_count,
        gc.reply_count,
        gc.created_at,
        gc.parent_comment_id,
        
        u.id as user_id,
        u.username,
        u.avatar,
        u.level,
        u.tier,
        u.role,
        
        cr.reaction_type as user_reaction
        
      FROM game_comments gc
      INNER JOIN users u ON gc.user_id = u.id
      LEFT JOIN comment_reactions cr ON cr.comment_id = gc.id AND cr.user_id = ?
      WHERE gc.game_id = ?
        AND gc.parent_comment_id IS NULL
        AND gc.is_deleted = 0
        AND gc.is_approved = 1
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const params = [userId, gameId, parseInt(limit), parseInt(offset)];

    // console.log("📝 Query params:", params); // Debug log

    //  CHANGED: Use query() instead of execute() for MySQL 9.x compatibility
    const [comments] = await db.query(query, params);

    // Get total count
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM game_comments 
       WHERE game_id = ? 
         AND parent_comment_id IS NULL 
         AND is_deleted = 0
         AND is_approved = 1`,
      [gameId]
    );

    // console.log(" Comments fetched successfully:", comments.length);

    res.json({
      comments,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + comments.length) < total
      }
    });

  } catch (err) {
    // console.error("❌ GET COMMENTS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch comments",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/* ================= GET REPLIES FOR A COMMENT ================= */
export async function getCommentReplies(req, res) {
  try {
    const { commentId } = req.params;

    //  DEFENSIVE CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;

    const query = `
      SELECT 
        gc.id,
        gc.content,
        gc.is_edited,
        gc.edited_at,
        gc.like_count,
        gc.created_at,
        gc.parent_comment_id,
        
        u.id as user_id,
        u.username,
        u.avatar,
        u.level,
        u.tier,
        u.role,
        
        cr.reaction_type as user_reaction
        
      FROM game_comments gc
      INNER JOIN users u ON gc.user_id = u.id
      LEFT JOIN comment_reactions cr ON cr.comment_id = gc.id AND cr.user_id = ?
      WHERE gc.parent_comment_id = ?
        AND gc.is_deleted = 0
        AND gc.is_approved = 1
      ORDER BY gc.created_at ASC
    `;

    const [replies] = await db.execute(query, [userId, commentId]);
    res.json(replies);

  } catch (err) {
    console.error("GET REPLIES ERROR:", err);
    res.status(500).json({ message: "Failed to fetch replies" });
  }
}

/* ================= POST NEW COMMENT ================= */
export async function createComment(req, res) {
  try {
    //  DEFENSIVE CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const { gameId, content, parentCommentId = null } = req.body;

    if (!content || content.trim().length < 2) {
      return res.status(400).json({ message: "Comment too short" });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: "Comment too long (max 1000 characters)" });
    }

    const profanityWords = ['badword1', 'badword2'];
    const lowerContent = content.toLowerCase();
    const hasProfanity = profanityWords.some(word => lowerContent.includes(word));
    const moderationStatus = hasProfanity ? 'pending' : 'approved';

    const [result] = await db.execute(
      `INSERT INTO game_comments 
       (game_id, user_id, parent_comment_id, content, moderation_status, is_approved)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [gameId, userId, parentCommentId, content, moderationStatus, !hasProfanity]
    );

    const commentId = result.insertId;

    if (parentCommentId) {
      await db.execute(
        'UPDATE game_comments SET reply_count = reply_count + 1 WHERE id = ?',
        [parentCommentId]
      );

      const [[parentComment]] = await db.execute(
        'SELECT user_id FROM game_comments WHERE id = ?',
        [parentCommentId]
      );

      if (parentComment && parentComment.user_id !== userId) {
        await createNotification({
          userId: parentComment.user_id,
          type: 'comment_reply',
          title: 'New Reply to Your Comment',
          message: `${req.user.username} replied to your comment`,
          actionUrl: `/game/${gameId}?comment=${commentId}`,
          actionText: 'View Reply',
          priority: 'normal'
        });
      }
    }

    const [[newComment]] = await db.execute(
      `SELECT gc.*, u.username, u.avatar, u.level, u.tier, u.role
       FROM game_comments gc
       INNER JOIN users u ON gc.user_id = u.id
       WHERE gc.id = ?`,
      [commentId]
    );

    res.status(201).json({
      message: hasProfanity ? "Comment submitted for moderation" : "Comment posted successfully",
      comment: newComment
    });

  } catch (err) {
    console.error("CREATE COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to post comment" });
  }
}

/* ================= UPDATE COMMENT ================= */
export async function updateComment(req, res) {
  try {
    //  DEFENSIVE CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length < 2) {
      return res.status(400).json({ message: "Comment too short" });
    }

    const [[comment]] = await db.execute(
      'SELECT user_id FROM game_comments WHERE id = ?',
      [commentId]
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.execute(
      'UPDATE game_comments SET content = ?, is_edited = TRUE, edited_at = NOW() WHERE id = ?',
      [content, commentId]
    );

    res.json({ message: "Comment updated successfully" });

  } catch (err) {
    // console.error("UPDATE COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to update comment" });
  }
}

/* ================= DELETE COMMENT ================= */
export async function deleteComment(req, res) {
  try {
    //  DEFENSIVE CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const { commentId } = req.params;

    const [[comment]] = await db.execute(
      'SELECT user_id, parent_comment_id FROM game_comments WHERE id = ?',
      [commentId]
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.execute(
      'UPDATE game_comments SET is_deleted = TRUE WHERE id = ?',
      [commentId]
    );

    if (comment.parent_comment_id) {
      await db.execute(
        'UPDATE game_comments SET reply_count = reply_count - 1 WHERE id = ?',
        [comment.parent_comment_id]
      );
    }

    res.json({ message: "Comment deleted successfully" });

  } catch (err) {
    console.error("DELETE COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }
}

/* ================= REACT TO COMMENT ================= */
export async function reactToComment(req, res) {
  try {
    //  DEFENSIVE CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const { commentId } = req.params;
    const { reactionType } = req.body;

    const validReactions = ['like', 'helpful', 'funny', 'love'];
    if (!validReactions.includes(reactionType)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const [[existing]] = await db.execute(
      'SELECT id FROM comment_reactions WHERE user_id = ? AND comment_id = ? AND reaction_type = ?',
      [userId, commentId, reactionType]
    );

    if (existing) {
      await db.execute('DELETE FROM comment_reactions WHERE id = ?', [existing.id]);
      await db.execute('UPDATE game_comments SET like_count = like_count - 1 WHERE id = ?', [commentId]);
      return res.json({ message: "Reaction removed", action: 'removed' });
    }

    await db.execute(
      'INSERT INTO comment_reactions (user_id, comment_id, reaction_type) VALUES (?, ?, ?)',
      [userId, commentId, reactionType]
    );

    await db.execute(
      'UPDATE game_comments SET like_count = like_count + 1 WHERE id = ?',
      [commentId]
    );

    res.json({ message: "Reaction added", action: 'added' });

  } catch (err) {
    // console.error("REACT TO COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to react" });
  }
}

/* ================= REPORT COMMENT ================= */
export async function reportComment(req, res) {
  try {
    //  DEFENSIVE CHECK
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userId = req.user.id;
    const { commentId } = req.params;
    const { reason, description } = req.body;

    const validReasons = ['spam', 'offensive', 'harassment', 'inappropriate', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ message: "Invalid report reason" });
    }

    const [[existing]] = await db.execute(
      'SELECT id FROM comment_reports WHERE comment_id = ? AND reported_by = ?',
      [commentId, userId]
    );

    if (existing) {
      return res.status(400).json({ message: "You already reported this comment" });
    }

    await db.execute(
      'INSERT INTO comment_reports (comment_id, reported_by, reason, description) VALUES (?, ?, ?, ?)',
      [commentId, userId, reason, description]
    );

    const [[{ report_count }]] = await db.execute(
      'SELECT COUNT(*) as report_count FROM comment_reports WHERE comment_id = ?',
      [commentId]
    );

    if (report_count >= 3) {
      await db.execute(
        'UPDATE game_comments SET is_flagged = TRUE WHERE id = ?',
        [commentId]
      );
    }

    res.json({ message: "Report submitted successfully" });

  } catch (err) {
    // console.error("REPORT COMMENT ERROR:", err);
    res.status(500).json({ message: "Failed to submit report" });
  }
}


