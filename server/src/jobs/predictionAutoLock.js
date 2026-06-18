// src/jobs/predictionAutoLock.js
import cron from "node-cron";
import { db } from "../db/index.js";

export function startPredictionAutoLock() {

  cron.schedule("* * * * *", async () => {
    try {

      const [result] = await db.execute(`
        UPDATE matches
        SET prediction_open = 0
        WHERE prediction_open = 1
          AND prediction_close_time IS NOT NULL
          AND prediction_close_time <= NOW()
      `);

      if (result.affectedRows > 0) {
        console.log(`🔒 Auto-locked ${result.affectedRows} matches`);
      }

    } catch (err) {
      console.error("Auto lock failed:", err);
    }
  });

}