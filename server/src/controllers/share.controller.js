// server/src/controllers/share.controller.js
import { awardPoints } from "../services/points.service.js";
import { db } from "../db/index.js";
import crypto from "crypto";


export async function generatedShareLink(req, res) {
  const userId = req.user.id;
  const { game_id, platform } = req.body;

  // const code = crypto.randomBytes(4).toString("hex");

  /* 1. Create share link */
  // const [link] = await db.execute(
  //   `
  //   INSERT INTO share_links (user_id, game_id, code, platform)
  //   VALUES (?, ?, ?, ?)
  //   `,
  //   [userId, game_id, code, platform]
  // );

  const [[existing]] = await db.execute(
    `SELECT code FROM share_links
    WHERE user_id = ? AND game_id = ? AND platform = ?`,
    [userId, game_id, platform]
  );

  let code;

  if (existing) {
    code = existing.code;
  } else {
    code = crypto.randomBytes(4).toString("hex");

    await db.execute(
      `INSERT INTO share_links (user_id, game_id, code, platform)
      VALUES (?, ?, ?, ?)`,
      [userId, game_id, code, platform]
    );
  }

  const shareUrl = `${process.env.BACKEND_URL}/s/${code}`;

  /* 2. Create activity log */
  const activityType = `${platform}_share`;

  const [log] = await db.execute(
    `
    INSERT INTO user_activity_log
    (user_id, activity_type, game_id, metadata)
    VALUES (?, ?, ?, ?)
    `,
    [
      userId,
      activityType,
      game_id || null,
      JSON.stringify({ platform, code })
    ]
  );

  const activityId = log.insertId;

  /* 3. Award points */
  const award = await awardPoints({
    userId,
    activityType,
    activityId,
    metadata: {
      platform,
      code
    }
  });

  /* 4. Remove log if points not awarded */
  if (!award.awarded) {
    await db.execute(
      `DELETE FROM user_activity_log WHERE id = ?`,
      [activityId]
    );
  }

  res.json({
    success: true,
    shareUrl,
    ...award
  });
}

export async function handleShareRedirect(req, res) {

  const { code } = req.params;
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "0.0.0.0";

  const [[link]] = await db.execute(
    `SELECT * FROM share_links WHERE code = ?`,
    [code]
  );

  if (!link) {
    return res.redirect(process.env.FRONTEND_URL);
  }

  /* 🚫 Prevent self-click reward */
  const [[ownerIp]] = await db.execute(
    `SELECT ip_address FROM share_clicks WHERE share_id = ? LIMIT 1`,
    [link.id]
  );

  if (ownerIp && ownerIp.ip_address === ip) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/games/${link.game_id}`
    );
  }

  /* 🚫 Prevent duplicate clicks */
  const [insert] = await db.execute(
    `
    INSERT IGNORE INTO share_clicks (share_id, ip_address)
    VALUES (?, ?)
    `,
    [link.id, ip]
  );

  /* If duplicate → affectedRows = 0 */
  if (insert.affectedRows === 0) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/games/${link.game_id}`
    );
  }

  /* Count valid clicks */
  const [[clickCount]] = await db.execute(
    `SELECT COUNT(*) as clicks FROM share_clicks WHERE share_id = ?`,
    [link.id]
  );

  /* Update click count */
  await db.execute(
    `UPDATE share_links SET clicks = ? WHERE id = ?`,
    [clickCount.clicks, link.id]
  );

  /* Award points */
  await awardPoints({
    userId: link.user_id,
    activityType: `${link.platform}_share_click`,
    metadata: {
      code,
      platform: link.platform
    }
  });

  return res.redirect(
    `${process.env.FRONTEND_URL}/games/${link.game_id}`
  );
}

export async function shareActivity(req, res) {
  const userId = req.user.id;
  const { share_type, game_id, platform } = req.body;

  let activityType = null;
  let metadata = null;

  if (share_type === "platform") {
    activityType = "visit_platform";
    metadata = { platform };
  } else if (share_type === "game") {
    activityType = "game_share";
    metadata = { game_id };
  } else if (share_type === "referral") {
    activityType = "share_referral";
    metadata = { target: "referral" };
  } else {
    return res.status(400).json({ message: "Invalid share_type" });
  }

  /* 1️⃣ Create activity log FIRST */
  const [log] = await db.execute(
    `
      INSERT INTO user_activity_log
      (user_id, activity_type, game_id, metadata)
      VALUES (?, ?, ?, ?)
    `,
    [
      userId,
      activityType,
      game_id || null,
      metadata ? JSON.stringify(metadata) : null
    ]
  );

  const activityId = log.insertId;

  const award = await awardPoints({
    userId,
    activityType,
    metadata,
    activityId
  });

  // 🔥 INSERT ACTIVITY LOG ONLY IF POINTS AWARDED
  /* 3️⃣ If not awarded → delete empty log */
  if (!award.awarded) {
    await db.execute(
      `DELETE FROM user_activity_log WHERE id = ?`,
      [activityId]
    );
    return res.json({ success: true, ...award });
  }

  /* 4️⃣ Update log with points */
  await db.execute(
    `
      UPDATE user_activity_log
      SET points_awarded = ?
      WHERE id = ?
    `,
    [award.points, activityId]
  );


  res.json({ success: true, ...award });
}

