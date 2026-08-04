require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createCourseTables = async () => {
  const queryText = `
    -- 1. Create the custom ENUM type for course status
    DO $$ BEGIN
      CREATE TYPE course_status AS ENUM ('Draft', 'Published');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- 2. Create the Courses table
    CREATE TABLE IF NOT EXISTS Courses (
      course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      faculty_id UUID REFERENCES Users(user_id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      price DECIMAL(10, 2) DEFAULT 0.00,
      status course_status DEFAULT 'Draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Create the Lessons table
    CREATE TABLE IF NOT EXISTS Lessons (
      lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      course_id UUID REFERENCES Courses(course_id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      video_key VARCHAR(255) NOT NULL,
      order_index INTEGER NOT NULL
    );
  `;

  try {
    console.log('⏳ Pushing LMS tables to PostgreSQL...');
    await pool.query(queryText);
    console.log('✅ Courses and Lessons tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  } finally {
    pool.end(); 
  }
};

createCourseTables();