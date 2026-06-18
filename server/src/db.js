import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "B/A,V.A01",
  database: "8jj_games",
});
