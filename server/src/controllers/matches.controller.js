// server/src/controllers/matches.controller.js
import { db } from "../db/index.js";


// ─────────────────────────────────────────────
// GET ALL MATCHES (Prediction Home)
// ─────────────────────────────────────────────
export async function getMatches(req, res) {
  try {
    const [matches] = await db.execute(
      `
      SELECT
        m.id,
        m.localteam_name AS team_a,
        m.visitorteam_name AS team_b,
        m.starting_at,
        m.starting_at AS match_start_time,
        m.prediction_close_time,  
        m.prediction_close_mode, 

        COALESCE(m.round,'Cricket Match') AS tournament,
        m.is_featured,

        CONCAT(m.localteam_name,' vs ',m.visitorteam_name) AS title,

        m.participation_cost AS stake_cost,
        m.allow_zero_cost AS zero_cost_enabled,
        'win_loss' AS prediction_type,

        m.prediction_open,
        m.winner,

        /* ✅ CORRECT STATUS */
        CASE
          WHEN m.winner IS NOT NULL THEN 'completed'
          WHEN m.prediction_open = 1 THEN 'open'
          ELSE 'closed'
        END AS status,

        COALESCE(
          t1.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/',m.localteam_id,'.png')
        ) AS team_a_logo,

        COALESCE(
          t2.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/',m.visitorteam_id,'.png')
        ) AS team_b_logo

      FROM matches m

      LEFT JOIN teams t1
        ON m.localteam_id = t1.sportmonks_id

      LEFT JOIN teams t2
        ON m.visitorteam_id = t2.sportmonks_id

      /* ONLY MATCHES WITH ACTIVE OPTIONS */
      WHERE EXISTS (
        SELECT 1
        FROM match_prediction_options mpo
        WHERE mpo.match_id = m.id
        AND mpo.is_active = 1
      )

      ORDER BY m.starting_at ASC
      `
    );

    // attach options
    if (matches.length > 0) {
      const ids = matches.map((m) => m.id);
      const placeholders = ids.map(() => "?").join(",");

      const [options] = await db.execute(
        `
        SELECT id, match_id, option_value AS label, odds
        FROM match_prediction_options
        WHERE match_id IN (${placeholders}) AND is_active = 1
        `,
        ids
      );

      const optionsByMatch = {};
      for (const opt of options) {
        if (!optionsByMatch[opt.match_id]) {
          optionsByMatch[opt.match_id] = [];
        }
        optionsByMatch[opt.match_id].push(opt);
      }

      for (const match of matches) {
        match.options = optionsByMatch[match.id] || [];
      }
    }

    res.json({ matches });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
}


// ─────────────────────────────────────────────
// GET SINGLE MATCH DETAILS
// ─────────────────────────────────────────────
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
        m.starting_at AS match_start_time,

        m.prediction_close_time,   
        m.prediction_close_mode,   

        'Cricket Match' AS tournament,
        CONCAT(m.localteam_name,' vs ',m.visitorteam_name) AS title,
        
        m.participation_cost AS stake_cost,
        m.allow_zero_cost AS zero_cost_enabled,
        'win_loss' AS prediction_type,

        m.prediction_open,
        m.winner,

        /* ✅ CORRECT STATUS (FIXED BUG HERE) */
        CASE
          WHEN m.winner IS NOT NULL THEN 'completed'
          WHEN m.prediction_open = 1 THEN 'open'
          ELSE 'closed'
        END AS status,

        COALESCE(
          t1.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/',m.localteam_id,'.png')
        ) AS team_a_logo,

        COALESCE(
          t2.logo_url,
          CONCAT('https://cdn.sportmonks.com/images/cricket/teams/',m.visitorteam_id,'.png')
        ) AS team_b_logo

      FROM matches m

      LEFT JOIN teams t1
        ON m.localteam_id = t1.sportmonks_id

      LEFT JOIN teams t2
        ON m.visitorteam_id = t2.sportmonks_id

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
    res.status(500).json({ message: "Failed to fetch match" });
  }
}