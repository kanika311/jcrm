import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  
  const tables = ['Users', 'Courses', 'Lessons', 'Enrollments', 'Platform_Settings', 'Testimonials'];
  
  for (const table of tables) {
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = $1 AND table_schema = 'public'
      ORDER BY ordinal_position
    `, [table]);
    
    console.log(`\n=== ${table} ===`);
    res.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));
  }
  
  client.release();
  await pool.end();
}

main().catch(console.error);
