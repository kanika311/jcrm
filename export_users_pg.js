const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  const res = await client.query('SELECT user_id as id, email, full_name, name, phone_number, role, created_at FROM "Users" ORDER BY created_at DESC');
  
  const markdownRows = res.rows.map(u => 
    `| ${u.id} | ${u.email} | ${u.full_name || u.name || '-'} | ${u.phone_number || '-'} | ${u.role} | ${new Date(u.created_at).toISOString()} |`
  ).join('\n');

  const markdownTable = `
# List of Users in Database

| ID | Email | Name | Phone | Role | Created At |
|---|---|---|---|---|---|
${markdownRows}
`;

  fs.writeFileSync('C:/Users/gsans/.gemini/antigravity/brain/8736ce5f-00ea-423b-85f5-14c21f24d4d1/users_list.md', markdownTable);
  console.log(`Exported ${res.rows.length} users to users_list.md`);
  
  await client.end();
}

main().catch(console.error);
