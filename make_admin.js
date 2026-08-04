const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  // Make gsanskarnew25@gmail.com an admin
  const res1 = await client.query(`
    UPDATE "Users" 
    SET role = 'ADMIN' 
    WHERE email = 'gsanskarnew25@gmail.com' OR email = 'gsanskargkp25@gmail.com'
  `);
  
  console.log(`Updated ${res1.rowCount} rows to ADMIN.`);
  
  await client.end();
}

main().catch(console.error);
