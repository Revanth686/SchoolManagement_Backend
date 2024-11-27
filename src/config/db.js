import mysql from "mysql2/promise";
import debug from "debug";
import dotenv from "dotenv";
dotenv.config();

const log = debug("app:database");

//using connection pool to handle connection
const pool = mysql.createPool({
  host: process.env.DBHOST || "localhost",
  user: process.env.DBUSER || "root",
  port: process.env.DBPORT || 3306,
  password: process.env.DBPASSWORD || "password",
  database: process.env.DBNAME || "school_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    log("Database connected successfully");

    //TODO: remv created_at field

    // creating school table iff doesnt yet exists
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        location POINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        SPATIAL INDEX idx_location (location)
      )
    `);

    log("Database table created");
  } catch (err) {
    log("Error connecting to database:", err);
    process.exit(1);
  }
};

export const getDb = () => pool;
