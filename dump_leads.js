const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  console.log("--- CONTACT MESSAGES ---");
  try {
    const contactRes = await client.query('SELECT * FROM "contact_messages"');
    console.log(JSON.stringify(contactRes.rows, null, 2));
  } catch (err) {
    console.error("Error reading contact_messages:", err.message);
  }

  console.log("\n--- CAREER GUIDANCE FORMS ---");
  try {
    const careerRes = await client.query('SELECT * FROM "career_guidance_forms"');
    console.log(JSON.stringify(careerRes.rows, null, 2));
  } catch (err) {
    console.error("Error reading career_guidance_forms:", err.message);
  }

  console.log("\n--- SIGNUP LEADS (from Users table) ---");
  try {
    const signupRes = await client.query('SELECT user_id, email, name, role, phone_number, created_at FROM "Users"');
    console.log(JSON.stringify(signupRes.rows, null, 2));
  } catch (err) {
    console.error("Error reading Users:", err.message);
  }
  
  await client.end();
}

main().catch(console.error);
