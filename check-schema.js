require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ambulance_booking',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.query(`
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public'
  ORDER BY table_name
`, (err, result) => {
  if (err) {
    console.error('Error querying tables:', err.message);
  } else if (result.rows.length === 0) {
    console.log('❌ No tables found - schema not initialized');
    console.log('Need to run: psql -U postgres -d ambulance_booking -f server/database/schema.sql');
  } else {
    console.log('✅ Database schema tables:');
    result.rows.forEach(row => console.log('  -', row.table_name));
  }
  process.exit(0);
});

setTimeout(() => {
  console.error('Timeout');
  process.exit(1);
}, 5000);
