import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "2525@2525",
  database: "8jj_games",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
