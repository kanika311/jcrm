const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  console.log("--- COURSES ---");
  try {
    const coursesRes = await client.query('SELECT * FROM "Courses"');
    console.log(JSON.stringify(coursesRes.rows, null, 2));
  } catch (err) {
    console.error("Error reading Courses:", err.message);
  }
  
  await client.end();
}

main().catch(console.error);
