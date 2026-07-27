const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  try {
    // Delete all users except these three emails
    const res = await client.query(`
      DELETE FROM "Users" 
      WHERE email NOT IN (
        'gsanskarnew25@gmail.com', 
        'gsanskargkp25@gmail.com', 
        'jcrm technology97@gmail.com'
      )
    `);
    
    console.log(`Successfully deleted ${res.rowCount} users.`);
  } catch (error) {
    console.error("Error deleting users:", error.message);
  }
  
  await client.end();
}

main();
