// import mysql from "mysql2/promise";

// export const db = mysql.createPool({
//   host: "localhost",
//   user: "8jj_user",
//   password: "password123",
//   database: "8jj_games",
//   waitForConnections: true,
//   connectionLimit: 10
// });
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ DEFINE envFile HERE
const envFile =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../../.env.production")
    : path.resolve(__dirname, "../../.env");


// ✅ LOAD ENV ONCE
dotenv.config({ path: envFile });

console.log("🌍 ENV:", process.env.NODE_ENV);
console.log("🗄️ DB USER:", process.env.DB_USER);
console.log("🗄️ DB NAME:", process.env.DB_NAME);

import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

// Optional: quick health log (safe)
db.getConnection()
  .then(conn => {
    console.log("✅ MySQL connected:", process.env.DB_NAME);
    conn.release();
  })
  .catch(err => {
    console.error("❌ MySQL connection failed:", err.message);
  });
