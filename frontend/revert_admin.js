const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  // Revert gsanskarnew25@gmail.com to STUDENT
  const res1 = await client.query(`
    UPDATE "Users" 
    SET role = 'STUDENT' 
    WHERE email != 'jcrm technology97@gmail.com' AND role = 'ADMIN'
  `);
  
  console.log(`Downgraded ${res1.rowCount} rows to STUDENT.`);
  
  await client.end();
}

main().catch(console.error);
