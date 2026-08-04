const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  console.log("--- OTP CODES ---");
  try {
    const otpRes = await client.query('SELECT * FROM "otp_codes"');
    console.log(JSON.stringify(otpRes.rows, null, 2));
  } catch (err) {
    console.error("Error reading otp_codes:", err.message);
  }
  
  await client.end();
}

main().catch(console.error);
