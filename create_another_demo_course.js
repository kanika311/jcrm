const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });
  
  await client.connect();
  
  try {
    // Get the instructor ID
    const instructorRes = await client.query("SELECT user_id FROM \"Users\" WHERE role = 'INSTRUCTOR' LIMIT 1");
    if (instructorRes.rows.length === 0) {
      console.log("No instructor found. Run create_demo_courses.js first.");
      await client.end();
      return;
    }
    const facultyId = instructorRes.rows[0].user_id;

    // Create a new demo course
    const newCourseRes = await client.query(`
      INSERT INTO "Courses" (course_id, faculty_id, title, description, price, status, created_at)
      VALUES (gen_random_uuid(), $1, 'Intro to AI/ML & Python', 'Learn Python and machine learning basics from scratch.', 99.99, 'DRAFT', NOW())
      RETURNING course_id, title
    `, [facultyId]);

    console.log(`Created course: ${newCourseRes.rows[0].title} with ID: ${newCourseRes.rows[0].course_id}`);
  } catch (err) {
    console.error("Error creating course:", err);
  } finally {
    await client.end();
  }
}

main();
