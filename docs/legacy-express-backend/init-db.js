require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTables = async () => {
  const queryText = `
    -- 1. Create the custom ENUM type for roles
    DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('Student', 'Employee', 'Super_Admin');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    -- 2. Create the Users table
    CREATE TABLE IF NOT EXISTS Users (
      user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role user_role NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('⏳ Pushing schema to PostgreSQL...');
    await pool.query(queryText);
    console.log('✅ Users table and Enum roles created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
  } finally {
    pool.end(); // Closes the connection so the script can finish
  }
};

createTables();