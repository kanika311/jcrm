const { Client } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Check if faculty exists, if not create one
    let facultyRes = await client.query('SELECT user_id FROM "Users" WHERE role = \'INSTRUCTOR\' LIMIT 1');
    let facultyId;
    
    if (facultyRes.rows.length === 0) {
      const insRes = await client.query(`
        INSERT INTO "Users" (user_id, full_name, name, email, password_hash, role, created_at)
        VALUES (gen_random_uuid(), 'Sarah Jenkins', 'Sarah Jenkins', 'sarah@jcrm technology.dev', $1, 'INSTRUCTOR', NOW())
        RETURNING user_id
      `, [passwordHash]);
      facultyId = insRes.rows[0].user_id;
      console.log("Created demo instructor Sarah Jenkins:", facultyId);
    } else {
      facultyId = facultyRes.rows[0].user_id;
      console.log("Using existing instructor:", facultyId);
    }
    
    // Check if courses already exist, if not create some
    const coursesCount = await client.query('SELECT COUNT(*) FROM "Courses"');
    if (parseInt(coursesCount.rows[0].count) === 0) {
      const c1 = await client.query(`
        INSERT INTO "Courses" (course_id, faculty_id, title, description, price, status, created_at)
        VALUES (gen_random_uuid(), $1, 'Full Stack React & Next.js', 'Master modern frontend development.', 199.99, 'PUBLISHED', NOW())
        RETURNING course_id
      `, [facultyId]);
      
      const c2 = await client.query(`
        INSERT INTO "Courses" (course_id, faculty_id, title, description, price, status, created_at)
        VALUES (gen_random_uuid(), $1, 'Advanced System Design', 'Architect scalable backend systems.', 299.99, 'DRAFT', NOW())
        RETURNING course_id
      `, [facultyId]);

      const c3 = await client.query(`
        INSERT INTO "Courses" (course_id, faculty_id, title, description, price, status, created_at)
        VALUES (gen_random_uuid(), $1, 'UI/UX for Developers', 'Design beautiful interfaces.', 149.99, 'PUBLISHED', NOW())
        RETURNING course_id
      `, [facultyId]);

      console.log("Created 3 demo courses!");
    } else {
      console.log("Courses already exist in database.");
    }
  } catch (err) {
    console.error("Error creating demo courses:", err);
  } finally {
    await client.end();
  }
}

main();
