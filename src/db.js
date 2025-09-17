// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'conveniencia_db',
  password: '1234',
  port: 5432,
});

function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  query,
  pool,   // <-- exporta também o pool
};
