// server/controllers/adminMatches.controller.js
import axios from "axios";
import { db } from "../db/index.js";
import { awardPoints } from "../services/points.service.js";

const BASE_URL = process.env.EIGHT_JJ_CRICKET_FIXTURE_URL;

function normalizeOptionValue(value) {
  return String(value || "").trim();
}

// CORRECT - manual just means admin-defined time, keep whatever they passed
// Remove that block entirely. resolveCloseTime() already handles it:

function resolveCloseTime({
  prediction_close_mode,
  match_start_time,
  prediction_close_time,
  estimated_end_time,
}) {
  if (prediction_close_mode === "before_start") {
    return prediction_close_time || match_start_time;
  }

  if (prediction_close_mode === "manual") {
    return prediction_close_time;  // ✅ use what admin provided, don't null it
  }

  if (prediction_close_mode === "auto_on_end") {
    return estimated_end_time || null;
  }

  return prediction_close_time || match_start_time;
}

export async function adminSyncMatches(req, res) {
  try {
    // 🔥 FETCH ALL TYPES
    const upcoming = await axios.get(`${BASE_URL}/api/fixtures/upcoming`);
    const live     = await axios.get(`${BASE_URL}/api/fixtures/live`);
    const recent   = await axios.get(`${BASE_URL}/api/fixtures/recent`);

    const fixtures = [
      ...(upcoming.data.data || upcoming.data),
      ...(live.data.data || live.data),
      ...(recent.data.data || recent.data),
    ];

    let synced = 0;

    for (const f of fixtures) {

      // ── Skip invalid ─────────────────────────────
      if (!f.sportmonks_id || !f.starting_at || !f.localteam?.name || !f.visitorteam?.name) {
        console.warn("⚠️ Skipping incomplete fixture:", f.sportmonks_id);
        continue;
      }

      const startTime = new Date(f.starting_at)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // ─────────────────────────────────────────────
      // ✅ FIX MATCH STATE
      // ─────────────────────────────────────────────
      let matchState = "upcoming";

      if (
        f.status === "Finished" ||
        f.status === "FT" ||
        f.status === "completed"
      ) {
        matchState = "completed";
      } 
      else if (f.live === true && f.status !== "NS") {
        matchState = "live";
      }

      // ─────────────────────────────────────────────
      // ✅ FIX SCORE EXTRACTION
      // ─────────────────────────────────────────────
      let homeScore = null;
      let awayScore = null;

      // PRIORITY 1 → direct API score (recent API)
      if (f.localteam_score || f.visitorteam_score) {
        homeScore = f.localteam_score || null;
        awayScore = f.visitorteam_score || null;
      }

      // PRIORITY 2 → runs array (live API)
      else if (Array.isArray(f.runs) && f.runs.length > 0) {
        const homeRun = f.runs.find(r => r.team_id == f.localteam_id);
        const awayRun = f.runs.find(r => r.team_id == f.visitorteam_id);

        if (homeRun) homeScore = `${homeRun.score}/${homeRun.wickets}`;
        if (awayRun) awayScore = `${awayRun.score}/${awayRun.wickets}`;
      }

      // ─────────────────────────────────────────────
      // ✅ SAFE WINNER CALCULATION
      // ─────────────────────────────────────────────
      let winnerName = null;

      if (homeScore && awayScore) {
        const homeRuns = parseInt(homeScore.split("/")[0] || 0);
        const awayRuns = parseInt(awayScore.split("/")[0] || 0);

        if (homeRuns > awayRuns) {
          winnerName = f.localteam.name;
        } else if (awayRuns > homeRuns) {
          winnerName = f.visitorteam.name;
        }
      }

      // ─────────────────────────────────────────────
      // ✅ STORE TEAMS
      // ─────────────────────────────────────────────
      if (f.localteam_id && f.localteam?.name) {
        const logo =
          f.localteam.image_path ||
          `https://cdn.sportmonks.com/images/cricket/teams/${f.localteam_id}.png`;

        await db.execute(
          `
          INSERT INTO teams (sportmonks_id, name, logo_url)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            logo_url = VALUES(logo_url)
          `,
          [f.localteam_id, f.localteam.name, logo]
        );
      }

      if (f.visitorteam_id && f.visitorteam?.name) {
        const logo =
          f.visitorteam.image_path ||
          `https://cdn.sportmonks.com/images/cricket/teams/${f.visitorteam_id}.png`;

        await db.execute(
          `
          INSERT INTO teams (sportmonks_id, name, logo_url)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            logo_url = VALUES(logo_url)
          `,
          [f.visitorteam_id, f.visitorteam.name, logo]
        );
      }

      // ─────────────────────────────────────────────
      // ✅ INSERT / UPDATE MATCH
      // ─────────────────────────────────────────────
      await db.execute(
        `
        INSERT INTO matches
          (sportmonks_id, league_id, season_id, round, starting_at,
           status, localteam_id, visitorteam_id, localteam_name,
           visitorteam_name, match_state,
           localteam_score, visitorteam_score, winner)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          status = VALUES(status),
          starting_at = VALUES(starting_at),
          match_state = VALUES(match_state),
          localteam_score = VALUES(localteam_score),
          visitorteam_score = VALUES(visitorteam_score),
          winner = VALUES(winner)
        `,
        [
          f.sportmonks_id ?? null,
          f.league_id ?? null,
          f.season_id ?? null,
          f.round ?? null,
          startTime,
          f.status ?? null,
          f.localteam_id ?? null,
          f.visitorteam_id ?? null,
          f.localteam.name,
          f.visitorteam.name,
          matchState,
          homeScore,
          awayScore,
          winnerName
        ]
      );

      synced++;
    }

    // ─────────────────────────────────────────────
    // ✅ UPDATE LIVE STATES
    // ─────────────────────────────────────────────
    const liveFixtures = live.data.data || live.data;
    const liveIds = liveFixtures.map(f => f.sportmonks_id).filter(Boolean);

    if (liveIds.length > 0) {
      const placeholders = liveIds.map(() => "?").join(",");

      await db.execute(
        `UPDATE matches 
         SET match_state = 'live'
         WHERE sportmonks_id IN (${placeholders})`,
        liveIds
      );
    }

    // ─────────────────────────────────────────────
    // ✅ AUTO CLOSE PREDICTIONS
    // ─────────────────────────────────────────────
    const [fallback] = await db.execute(
      `UPDATE matches 
       SET prediction_open = 0
       WHERE prediction_open = 1
         AND prediction_close_time IS NOT NULL
         AND prediction_close_time <= NOW()`
    );

    res.json({
      success: true,
      synced,
      locked_by_time: fallback.affectedRows,
    });

  } catch (err) {
    console.error("❌ Match sync failed:", err);
    res.status(500).json({
      message: "Match sync failed",
      error: err.message
    });
  }
}


export async function getFixtures(req, res) {
  try {
    const [fixtures] = await db.execute(
      `SELECT id, sportmonks_id, localteam_name AS team_a,
              visitorteam_name AS team_b, starting_at, match_state AS status
       FROM matches ORDER BY starting_at ASC`
    );
    res.json({ fixtures });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch fixtures" });
  }
}

export async function getAdminMatches(req, res) {
  try {
    const [matches] = await db.execute(
      `
      SELECT
        m.id,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.winner,
        m.starting_at,
        m.starting_at AS match_start_time,
        m.starting_at AS prediction_close_time,
        m.is_featured,
        'Cricket Match' AS tournament,
        CONCAT(m.localteam_name,' vs ',m.visitorteam_name) AS title,
        m.participation_cost AS stake_cost,
        m.allow_zero_cost AS zero_cost_enabled,
        'win_loss' AS prediction_type,
        m.match_state,
        m.prediction_open,

        CASE
          WHEN m.winner IS NOT NULL THEN 'completed'
          WHEN m.prediction_open = 0 THEN 'closed'
          ELSE 'upcoming'
        END AS status

      FROM matches m

      WHERE EXISTS (
        SELECT 1
        FROM match_prediction_options mpo
        WHERE mpo.match_id = m.id
        AND mpo.is_active = 1
      )

      ORDER BY m.starting_at ASC
      `
    );

    if (matches.length > 0) {
      const ids          = matches.map((m) => m.id);
      const placeholders = ids.map(() => "?").join(",");
      const [options]    = await db.execute(
        `SELECT id, match_id, option_value AS label, odds
         FROM match_prediction_options
         WHERE match_id IN (${placeholders}) AND is_active = 1`,
        ids
      );
      const byMatch = {};
      for (const opt of options) {
        if (!byMatch[opt.match_id]) byMatch[opt.match_id] = [];
        byMatch[opt.match_id].push(opt);
      }
      for (const m of matches) m.options = byMatch[m.id] || [];
    }

    res.json({ matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
}


export async function createPredictionMatch(req, res) {
  try {
    const {
      sportmonks_id,
      match_start_time,
      prediction_close_time,
      prediction_close_mode = "before_start",
      estimated_end_time,
      participation_cost,
      allow_zero_cost,
      allow_live_predictions,
      title,
      options = [],
    } = req.body;

    if (!sportmonks_id) {
      return res.status(400).json({ message: "Match is required" });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: "Minimum 2 prediction options required" });
    }

    let finalCloseTime = resolveCloseTime({
      prediction_close_mode,
      match_start_time,
      prediction_close_time,
      estimated_end_time,
    });

    const [[match]] = await db.execute(
      `SELECT id, localteam_name, visitorteam_name
       FROM matches
       WHERE sportmonks_id = ? OR id = ?
       LIMIT 1`,
      [sportmonks_id, sportmonks_id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const matchId = match.id;

    const [[count]] = await db.execute(
      `SELECT COUNT(*) AS total FROM user_predictions WHERE match_id = ?`,
      [matchId]
    );

    if (count.total > 0) {
      return res.status(400).json({
        message: "Cannot recreate prediction options after users have predicted",
      });
    }

    await db.execute(
      `UPDATE matches
       SET prediction_open = 1,
           participation_cost = ?,
           allow_zero_cost = ?,
           allow_live_predictions = ?,
           prediction_close_time = ?,
           prediction_close_mode = ?,
           estimated_end_time = ?,
           title = ?
       WHERE id = ?`,
      [
        participation_cost || 0,
        allow_zero_cost ? 1 : 0,
        allow_live_predictions ? 1 : 0,
        finalCloseTime,
        prediction_close_mode,
        estimated_end_time || null,
        title || null,
        matchId,
      ]
    );

    await db.execute(
      `DELETE FROM match_prediction_options WHERE match_id = ?`,
      [matchId]
    );

    for (const opt of options) {
      let finalValue = normalizeOptionValue(opt.value || opt.label);

      if (finalValue === "option_a") finalValue = match.localteam_name;
      if (finalValue === "option_b") finalValue = match.visitorteam_name;

      if (!finalValue || finalValue.startsWith("option_")) {
        return res.status(400).json({
          message: `Invalid option value: ${finalValue}`,
        });
      }

      await db.execute(
        `INSERT INTO match_prediction_options
         (match_id, option_type, option_value, odds, is_active)
         VALUES (?, ?, ?, ?, 1)`,
        [
          matchId,
          opt.type || "winner",
          finalValue,
          opt.odds,
        ]
      );
    }

    res.json({
      success: true,
      match_id: matchId,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create prediction match" });
  }
}

// ── EDIT PREDICTION MATCH (ODDS + SETTINGS) ────────────────────────────────────────────────────────────
export async function editPredictionMatch(req, res) {
  try {
    const { id } = req.params;

    const {
      match_start_time,
      prediction_close_time,
      prediction_close_mode = "before_start",
      estimated_end_time,
      participation_cost,
      allow_zero_cost,
      allow_live_predictions,
      title,
      options = [],
    } = req.body;

    const [[match]] = await db.execute(
      `SELECT id, localteam_name, visitorteam_name, winner
       FROM matches
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.winner) {
      return res.status(400).json({
        message: "Cannot edit a completed match"
      });
    }

    let finalCloseTime = resolveCloseTime({
      prediction_close_mode,
      match_start_time,
      prediction_close_time,
      estimated_end_time,
    });

    await db.execute(
      `UPDATE matches
       SET participation_cost = ?,
           allow_zero_cost = ?,
           allow_live_predictions = ?,
           prediction_close_time = ?,
           prediction_close_mode = ?,
           estimated_end_time = ?,
           title = ?,
           prediction_open = CASE
            WHEN ? = 'manual' THEN 1
            ELSE prediction_open
          END
       WHERE id = ?`,
      [
        participation_cost || 0,
        allow_zero_cost ? 1 : 0,
        allow_live_predictions ? 1 : 0,
        finalCloseTime,
        prediction_close_mode,
        estimated_end_time || null,
        title || null,
        prediction_open,
        id,
      ]
    );

    const [[count]] = await db.execute(
      `SELECT COUNT(*) AS total FROM user_predictions WHERE match_id = ?`,
      [id]
    );

    if (count.total > 0) {
      // Users already predicted: only update odds, never delete/change option values.
      for (const opt of options) {
        const finalValue = normalizeOptionValue(opt.value || opt.label);

        await db.execute(
          `UPDATE match_prediction_options
           SET odds = ?
           WHERE match_id = ?
             AND option_value = ?
             AND is_active = 1`,
          [opt.odds, id, finalValue]
        );
      }

      return res.json({
        success: true,
        mode: "odds_only",
      });
    }

    // No predictions yet: full option replacement allowed.
    await db.execute(
      `DELETE FROM match_prediction_options WHERE match_id = ?`,
      [id]
    );

    for (const opt of options) {
      let finalValue = normalizeOptionValue(opt.value || opt.label);

      if (finalValue === "option_a") finalValue = match.localteam_name;
      if (finalValue === "option_b") finalValue = match.visitorteam_name;

      if (!finalValue || finalValue.startsWith("option_")) {
        return res.status(400).json({
          message: `Invalid option value: ${finalValue}`,
        });
      }

      await db.execute(
        `INSERT INTO match_prediction_options
         (match_id, option_type, option_value, odds, is_active)
         VALUES (?, ?, ?, ?, 1)`,
        [
          id,
          opt.type || "winner",
          finalValue,
          opt.odds,
        ]
      );
    }

    res.json({
      success: true,
      mode: "full_edit",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to edit prediction match" });
  }
}

// ── DELETE PREDICTION MATCH ────────────────────────────────────────────────────────────
export async function deletePredictionMatch(req, res) {
  try {
    const { id } = req.params;

    const [[match]] = await db.execute(
      `SELECT id FROM matches WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const [[count]] = await db.execute(
      `SELECT COUNT(*) AS total FROM user_predictions WHERE match_id = ?`,
      [id]
    );

    if (count.total > 0) {
      // Soft delete if users already predicted.
      await db.execute(
        `UPDATE match_prediction_options
         SET is_active = 0
         WHERE match_id = ?`,
        [id]
      );
    } else {
      // Hard delete if no users predicted.
      await db.execute(
        `DELETE FROM match_prediction_options WHERE match_id = ?`,
        [id]
      );
    }

    await db.execute(
      `UPDATE matches
       SET prediction_open = 0,
           is_featured = 0
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      deleted_type: count.total > 0 ? "soft" : "hard",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete prediction match" });
  }
}

export async function lockPredictionMatch(req, res) {
  try {
    const { id } = req.params;

    const [[match]] = await db.execute(
      `SELECT id, prediction_open, winner
       FROM matches
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.winner) {
      return res.status(400).json({
        message: "Cannot lock — match already completed",
      });
    }

    if (match.prediction_open === 0) {
      return res.status(400).json({
        message: "Predictions already locked",
      });
    }

    await db.execute(
      `UPDATE matches
       SET prediction_open = 0,
           prediction_close_time = NOW(),
           prediction_close_mode = 'manual'
       WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: "Predictions locked",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to lock prediction match" });
  }
}


// ── Set winner + settle predictions + award points ────────────────────────────
export async function setMatchWinner(req, res) {
  try {
    const { id }     = req.params;
    const { winner } = req.body;

    // 1. Update match
    await db.execute(
      `UPDATE matches SET winner = ?, match_state = 'completed', prediction_open = 0 WHERE id = ?`,
      [winner, id]
    );

    // 2. Get all unsettled predictions for this match
    const [rows] = await db.execute(
      `
      SELECT
        up.id,
        up.user_id,
        up.match_id,
        up.option_id,
        up.stake_points AS stake_cost,
        up.potential_reward,
        up.points_awarded,
        up.is_correct,
        mpo.option_value AS user_prediction,
        mpo.odds,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at,
        m.winner,

        CASE
          WHEN m.winner IS NOT NULL THEN 'completed'
          WHEN m.prediction_open = 0 THEN 'closed'
          ELSE 'upcoming'
        END AS status

      FROM user_predictions up
      JOIN match_prediction_options mpo ON up.option_id = mpo.id
      JOIN matches m ON up.match_id = m.id
      WHERE up.match_id = ?
      `,
      [id]
    );

    let awarded = 0;
    let settled = 0;

    for (const p of rows) {
      const isCorrect = p.user_prediction === winner;
      const pts = isCorrect ? (p.potential_reward || 0) : 0;

      await db.execute(
        `UPDATE user_predictions SET 
         is_correct = ?, points_awarded = ? 
         WHERE id = ?`,
        [isCorrect ? 1 : 0, pts, p.id]
      );

      if (isCorrect && pts > 0) {
        
        const awardResult = await awardPoints({
          userId: p.user_id,
          activityType: "match_prediction_win",
          activityId: p.id, // important: prediction row id
          customPoints: pts,
          metadata: {
            matchId: p.match_id,
            winner,
            teamPicked: p.user_prediction,
            odds: p.odds
          },
          note: `Prediction win: ${p.user_prediction}`
        });

        if (awardResult.awarded) {
          await db.execute(
            `
            INSERT INTO user_activity_log
              (user_id, activity_type, game_id, metadata, points_awarded)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
              p.user_id,
              "match_prediction_win",
              null,
              JSON.stringify({
                match_id: p.match_id,
                prediction_id: p.id,
                picked: p.user_prediction,
                winner
              }),
              awardResult.points
            ]
          );
        }
        awarded += pts;
      }
      settled++;
    }

    console.log(`✅ Settled ${settled} predictions for match ${id}, awarded ${awarded} total pts`);
    res.json({ 
      success: true, 
      settled, 
      awarded 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to set winner" 
    });
  }
}

// ── Admin unlock predictions ─────────────────────────────────────────────
export async function unlockMatchPredictions(req, res) {
  try {
    const { id } = req.params;

    const [[match]] = await db.execute(
      `SELECT id, prediction_open, winner, starting_at
       FROM matches
       WHERE id = ?`,
      [id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.winner) {
      return res.status(400).json({
        message: "Cannot unlock — match already completed"
      });
    }

    if (match.prediction_open === 1) {
      return res.status(400).json({
        message: "Predictions already open"
      });
    }

    await db.execute(
      `UPDATE matches
       SET prediction_open = 1
       WHERE id = ?`,
      [id]
    );

    console.log(`🔓 Admin unlocked predictions for match ${id}`);

    res.json({
      success: true,
      message: "Predictions unlocked"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: "Failed to unlock match" 
    });
  }
}


export async function toggleFeaturedMatch(req, res) {
  try {
    const { id } = req.params;

    const [[match]] = await db.execute(
      `SELECT is_featured FROM matches WHERE id = ?`,
      [id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const newValue = match.is_featured ? 0 : 1;

    // allow only one featured match
    if (newValue === 1) {
      await db.execute(`UPDATE matches SET is_featured = 0`);
    }

    await db.execute(
      `UPDATE matches SET is_featured = ? WHERE id = ?`,
      [newValue, id]
    );

    res.json({ success: true, is_featured: newValue });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to toggle featured match" });
  }
}

export async function getMatchDetails(req, res) {
  try {
    const { id } = req.params;

    const [[match]] = await db.execute(
      `
      SELECT
        m.id,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at,
        m.prediction_close_time,
        m.prediction_close_mode,
        m.estimated_end_time,
        m.participation_cost AS stake_cost,
        m.allow_zero_cost AS zero_cost_enabled,
        m.title,
        m.winner
      FROM matches m
      WHERE m.id = ?
      `,
      [id]
    );

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const [options] = await db.execute(
      `
      SELECT
        id,
        option_value AS label,
        odds
      FROM match_prediction_options
      WHERE match_id = ?
      AND is_active = 1
      `,
      [id]
    );

    match.options = options;

    res.json({ match });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch match details" });
  }
}