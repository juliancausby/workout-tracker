const { Pool } = require('pg');

const pool = new Pool({
  user: 'julianhazcatss', 
  host: 'localhost',
  database: 'workout_tracker',
  password: '', 
  port: 5432,
});

module.exports = pool;