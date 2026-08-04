import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  const client = await pool.connect();
  console.log('Connected to database!');

  try {
    const passwordHash = await bcrypt.hash('password123', 10);

    // Clean up existing data
    try { await client.query(`DELETE FROM "Enrollments"`); } catch(e) { console.error(e.message) }
    try { await client.query(`DELETE FROM "Lessons"`); } catch(e) { console.error(e.message) }
    try { await client.query(`DELETE FROM "Courses"`); } catch(e) { console.error(e.message) }
    try { await client.query(`DELETE FROM "Platform_Settings"`); } catch(e) { console.error(e.message) }
    try { await client.query(`DELETE FROM "Users"`); } catch(e) { console.error(e.message) }
    console.log('Cleaned existing data.');

    // Create Users
    const admin = await client.query(
      `INSERT INTO "Users" (user_id, full_name, email, password_hash, role, created_at) 
       VALUES (gen_random_uuid(), 'Aushutosh Admin', 'admin@aushutosh.dev', $1, 'ADMIN', NOW()) 
       RETURNING user_id`,
      [passwordHash]
    );
    console.log('Admin created:', admin.rows[0].user_id);

    const faculty1 = await client.query(
      `INSERT INTO "Users" (user_id, full_name, email, password_hash, role, created_at) 
       VALUES (gen_random_uuid(), 'Sarah Jenkins', 'sarah@aushutosh.dev', $1, 'INSTRUCTOR', NOW()) 
       RETURNING user_id`,
      [passwordHash]
    );
    console.log('Faculty 1 created:', faculty1.rows[0].user_id);

    const faculty2 = await client.query(
      `INSERT INTO "Users" (user_id, full_name, email, password_hash, role, created_at) 
       VALUES (gen_random_uuid(), 'David Kim', 'david@aushutosh.dev', $1, 'INSTRUCTOR', NOW()) 
       RETURNING user_id`,
      [passwordHash]
    );
    console.log('Faculty 2 created:', faculty2.rows[0].user_id);

    const student1 = await client.query(
      `INSERT INTO "Users" (user_id, full_name, email, password_hash, role, created_at) 
       VALUES (gen_random_uuid(), 'Jane Student', 'demo@aushutosh.dev', $1, 'STUDENT', NOW()) 
       RETURNING user_id`,
      [passwordHash]
    );
    console.log('Student 1 created:', student1.rows[0].user_id);

    const student2 = await client.query(
      `INSERT INTO "Users" (user_id, full_name, email, password_hash, role, created_at) 
       VALUES (gen_random_uuid(), 'John Learner', 'john@aushutosh.dev', $1, 'STUDENT', NOW()) 
       RETURNING user_id`,
      [passwordHash]
    );
    console.log('Student 2 created:', student2.rows[0].user_id);

    // Create Courses
    const course1 = await client.query(
      `INSERT INTO "Courses" (course_id, faculty_id, title, description, price, status, created_at) 
       VALUES (gen_random_uuid(), $1, 'Full Stack React & Next.js', 'Master the modern React ecosystem.', 199.99, 'PUBLISHED', NOW()) 
       RETURNING course_id`,
      [faculty1.rows[0].user_id]
    );

    const course2 = await client.query(
      `INSERT INTO "Courses" (course_id, faculty_id, title, description, price, status, created_at) 
       VALUES (gen_random_uuid(), $1, 'Advanced System Design', 'Learn to architect scalable systems.', 299.99, 'PUBLISHED', NOW()) 
       RETURNING course_id`,
      [faculty2.rows[0].user_id]
    );
    console.log('Courses created.');

    // Create Lessons
    await client.query(
      `INSERT INTO "Lessons" (lesson_id, course_id, title, video_key, order_index) VALUES 
       (gen_random_uuid(), $1, 'Introduction to Next.js', 'intro_next.mp4', 1),
       (gen_random_uuid(), $1, 'Server Components', 'rsc.mp4', 2),
       (gen_random_uuid(), $1, 'Prisma & Postgres', 'db.mp4', 3)`,
      [course1.rows[0].course_id]
    );

    await client.query(
      `INSERT INTO "Lessons" (lesson_id, course_id, title, video_key, order_index) VALUES 
       (gen_random_uuid(), $1, 'Microservices Architecture', 'microservices.mp4', 1),
       (gen_random_uuid(), $1, 'Database Sharding', 'sharding.mp4', 2)`,
      [course2.rows[0].course_id]
    );
    console.log('Lessons created.');

    // Create Enrollments
    await client.query(
      `INSERT INTO "Enrollments" (enrollment_id, student_id, course_id, transaction_id, payment_status, progress_percent, enrolled_at) VALUES 
       (gen_random_uuid(), $1, $2, 'txn_123456789', 'COMPLETED', 45, NOW())`,
      [student1.rows[0].user_id, course1.rows[0].course_id]
    );

    await client.query(
      `INSERT INTO "Enrollments" (enrollment_id, student_id, course_id, transaction_id, payment_status, progress_percent, enrolled_at) VALUES 
       (gen_random_uuid(), $1, $2, 'txn_987654321', 'COMPLETED', 100, NOW())`,
      [student2.rows[0].user_id, course1.rows[0].course_id]
    );

    await client.query(
      `INSERT INTO "Enrollments" (enrollment_id, student_id, course_id, transaction_id, payment_status, progress_percent, enrolled_at) VALUES 
       (gen_random_uuid(), $1, $2, 'txn_555555555', 'COMPLETED', 10, NOW())`,
      [student1.rows[0].user_id, course2.rows[0].course_id]
    );
    console.log('Enrollments created.');

    console.log('\n✅ Database seeding complete!');
    console.log('\n📋 Demo Accounts (use these on the live site):');
    console.log('  🎓 Student:    demo@aushutosh.dev / password123');
    console.log('  👨‍🏫 Faculty:    sarah@aushutosh.dev / password123');
    console.log('  🔑 Admin:      admin@aushutosh.dev / password123');

  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
