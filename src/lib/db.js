import mysql from "mysql2/promise";

// Pooling is better than createConnection() because it reuses db connections
const pool = mysql.createPool({ 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;