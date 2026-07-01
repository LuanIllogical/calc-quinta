require('dotenv').config();

const pool = require('./Database/connection');

pool.query('SELECT NOW()')
  .then(res => console.log(res.rows[0]))
  .catch(err => console.log(err));
