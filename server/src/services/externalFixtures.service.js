// server/src/services/externalFixtures.service.js
import axios from "axios";
import { db } from "../db/index.js";
import { awardPoints } from "../services/points.service.js";

const BASE_URL = "https://8jjcricket.com";

export async function syncMatches() {
  try {
    const upcomingRes = await axios.get(`${BASE_URL}/api/fixtures/upcoming`);
    const upcomingRaw = upcomingRes.data.data || upcomingRes.data;

    // 👉 next 14 days
    const now = new Date();
    const next14Days = new Date();
    next14Days.setDate(now.getDate() + 14);

    const upcoming = upcomingRaw.filter(f => {
      if (!f.starting_at) return false;

      const matchDate = new Date(f.starting_at);
      return matchDate >= now && matchDate <= next14Days;
    })
    .slice(0, 100);

    const live     = await axios.get(`${BASE_URL}/api/fixtures/live`);
    const recentRes = await axios.get(`${BASE_URL}/api/fixtures/recent`);
    const recentRaw = recentRes.data.data || recentRes.data;

    //  get date 30 days ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    //  filter recent matches
    const recent = recentRaw.filter(f => {
      if (!f.starting_at) return false;
      return new Date(f.starting_at) >= oneMonthAgo;
    })
    .slice(0, 100);

    const fixtures = [
      ...upcoming,
      ...(live.data.data    || live.data),
      ...recent,
    ];

    let synced = 0;

    for (const f of fixtures) {

      // ── Skip invalid ─────────────────────────────
      if (!f.sportmonks_id || !f.starting_at || !f.localteam?.name || !f.visitorteam?.name) {
        console.warn("⚠️ Skipping incomplete fixture:", f.sportmonks_id);
        continue;
      }

      const startTime = new Date(f.starting_at)
        .toISOString().slice(0, 19).replace("T", " ");

      // ─────────────────────────────────────────────
      // ✅ FIX MATCH STATE (IMPORTANT)
      // ─────────────────────────────────────────────
      let state = "upcoming";

      if (
        f.status === "Finished" ||
        f.status === "FT" ||
        f.status === "completed"
      ) {
        state = "completed";
      } 
      else if (f.live === true && f.status !== "NS") {
        state = "live";
      }

      // ─────────────────────────────────────────────
      // ✅ FIX SCORE EXTRACTION (MAIN FIX)
      // ─────────────────────────────────────────────
      let homeScore = null;
      let awayScore = null;

      // PRIORITY 1 → direct API score (your recent API case)
      if (f.localteam_score || f.visitorteam_score) {
        homeScore = f.localteam_score || null;
        awayScore = f.visitorteam_score || null;
      }

      // PRIORITY 2 → runs array (live API case)
      else if (Array.isArray(f.runs) && f.runs.length > 0) {
        const homeRun = f.runs.find(r => r.team_id == f.localteam_id);
        const awayRun = f.runs.find(r => r.team_id == f.visitorteam_id);

        if (homeRun) {
          homeScore = `${homeRun.score}/${homeRun.wickets}`;
        }

        if (awayRun) {
          awayScore = `${awayRun.score}/${awayRun.wickets}`;
        }
      }

      // ─────────────────────────────────────────────
      // ✅ FIX WINNER (optional but recommended)
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
      // ✅ INSERT / UPDATE
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
          state,
          homeScore,
          awayScore,
          winnerName
        ]
      );

      synced++;
    }
    console.log(`✅ Synced ${synced} matches (including recent)`);
    console.log("Upcoming filtered:", upcoming.length);
    console.log("Live:", live.data.data?.length);
    console.log("Recent filtered:", recent.length);

    // Lock matches Sportmonks reports as LIVE
    const liveFixtures = live.data.data || live.data;
    const liveIds = liveFixtures.map((f) => f.sportmonks_id).filter(Boolean);
    if (liveIds.length > 0) {
      const ph = liveIds.map(() => "?").join(",");
      // const [r] = await db.execute(
      //   `UPDATE matches SET prediction_open = 0, match_state = 'live'
      //    WHERE sportmonks_id IN (${ph}) AND prediction_open = 1`,
      //   liveIds
      // );
      const [r] = await db.execute(
        `UPDATE matches 
        SET match_state = 'live'
        WHERE sportmonks_id IN (${ph})`,
        liveIds
      );
      if (r.affectedRows > 0) 
        console.log(`🔄 Updated ${r.affectedRows} live matches`);
    }
    

    // Fallback: lock anything past its start time

    const [t] = await db.execute(
      `UPDATE matches 
        SET prediction_open = 0
        WHERE prediction_open = 1
          AND prediction_close_time IS NOT NULL
          AND prediction_close_time <= NOW()`
    );
    // const [t] = await db.execute(
    //   `UPDATE matches SET prediction_open = 0
    //    WHERE prediction_open = 1 AND starting_at <= NOW()`
    // );
    if (t.affectedRows > 0) console.log(`🔒 Locked ${t.affectedRows} matches by start time`);

    console.log(`✅ syncMatches complete — ${synced} processed`);
  } catch (err) {
    console.error("❌ syncMatches failed:", err.message);
  }
}

export async function resolveFinishedMatches() {
  try {
    console.log("🔄 Running resolveFinishedMatches...");
    const res      = await axios.get(`${BASE_URL}/api/fixtures/recent`);
    const fixtures = res.data.data || res.data;

    for (const f of fixtures) {
      if (!f.sportmonks_id || !f.localteam?.name || !f.visitorteam?.name) continue;

      console.log("Checking fixture:", f.sportmonks_id, f.status);

      const [[match]] = await db.execute(
        `SELECT * FROM matches WHERE sportmonks_id = ?`,
        [f.sportmonks_id]
      );

      console.log("DB match:", match?.id, "resolved:", match?.is_resolved);

      if (!match || match.is_resolved) continue;

      // ✅ NEW: Extract scores safely
      let localRuns = null;
      let visitorRuns = null;

      // Case 1: string scores (199/5)
      if (f.localteam_score && f.visitorteam_score) {
        localRuns   = parseInt((f.localteam_score || "0").split("/")[0]);
        visitorRuns = parseInt((f.visitorteam_score || "0").split("/")[0]);
      }

      // Case 2: runs array (live API)
      else if (f.runs && f.runs.length > 0) {
        const homeRun = f.runs.find(r => r.team_id === f.localteam_id);
        const awayRun = f.runs.find(r => r.team_id === f.visitorteam_id);

        if (homeRun) localRuns = homeRun.score;
        if (awayRun) visitorRuns = awayRun.score;
      }

      // ❌ If still no score → skip
      if (localRuns == null || visitorRuns == null) {
        console.warn("⚠️ Skipping — no score yet:", f.sportmonks_id);
        continue;
      }

      // ✅ ONLY resolve finished matches
      if (
        f.status === "Finished" ||
        f.status === "FT" ||
        f.status === "completed"
      ) {
        const totalRuns = localRuns + visitorRuns;

        let winnerName = null;

        if (localRuns > visitorRuns) {
          winnerName = f.localteam.name;
        } else if (visitorRuns > localRuns) {
          winnerName = f.visitorteam.name;
        }

        if (!winnerName) {
          console.warn("⚠️ No winner (tie or invalid):", f.sportmonks_id);
          continue;
        }

        // ✅ Update DB
        await db.execute(
          `UPDATE matches
          SET winner = ?, match_state = 'completed', prediction_open = 0, is_resolved = TRUE
          WHERE id = ?`,
          [winnerName, match.id]
        );

        // ✅ keep your existing logic intact
        await settleWinLossPredictions(match.id, winnerName);
        await settleScorePredictions(match.id, totalRuns);
      }
    }
    console.log("✅ resolveFinishedMatches complete");
  } catch (err) {
    console.error("❌ resolveFinishedMatches failed:", err.message);
  }
}

async function settleWinLossPredictions(matchId, winnerName) {
  const [rows] = await db.execute(
    `SELECT up.id, up.user_id, up.potential_reward, mpo.option_value
     FROM user_predictions up
     JOIN match_prediction_options mpo ON up.option_id = mpo.id
     WHERE up.match_id = ? AND mpo.option_type = 'winner' AND up.is_correct IS NULL`,
    [matchId]
  );
  for (const p of rows) {
    const isCorrect = p.option_value === winnerName;
    const awarded   = isCorrect ? (p.potential_reward || 0) : 0;
    await db.execute(
      `UPDATE user_predictions SET is_correct = ?, points_awarded = ? WHERE id = ?`,
      [isCorrect ? 1 : 0, awarded, p.id]
    );
    if (isCorrect && awarded > 0) {
      await awardPoints({ userId: p.user_id, activityType: "match_prediction_correct", points: awarded });
      console.log(`🎯 +${awarded} pts → user ${p.user_id}`);
    }
  }
}

async function settleScorePredictions(matchId, totalRuns) {
  const [rows] = await db.execute(
    `SELECT up.id, up.user_id, up.potential_reward, mpo.option_value
     FROM user_predictions up
     JOIN match_prediction_options mpo ON up.option_id = mpo.id
     WHERE up.match_id = ? AND mpo.option_type = 'score_range' AND up.is_correct IS NULL`,
    [matchId]
  );
  for (const p of rows) {
    const isCorrect = scoreRangeMatches(p.option_value, totalRuns);
    const awarded   = isCorrect ? (p.potential_reward || 0) : 0;
    await db.execute(
      `UPDATE user_predictions SET is_correct = ?, points_awarded = ? WHERE id = ?`,
      [isCorrect ? 1 : 0, awarded, p.id]
    );
    if (isCorrect && awarded > 0) {
      await awardPoints({ userId: p.user_id, activityType: "match_prediction_correct", points: awarded });
      console.log(`🎯 Score +${awarded} pts → user ${p.user_id}`);
    }
  }
}

function scoreRangeMatches(optionValue, totalRuns) {
  if (optionValue.startsWith("under_")) return totalRuns < parseInt(optionValue.replace("under_", ""));
  if (optionValue.startsWith("over_"))  return totalRuns > parseInt(optionValue.replace("over_", ""));
  const [min, max] = optionValue.split("_").map(Number);
  return totalRuns >= min && totalRuns <= max;
}