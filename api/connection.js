const { Pool } = require('pg');

// Conexão com o banco postgres
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: "-c search_path=calc_quinta"
});

module.exports = pool;