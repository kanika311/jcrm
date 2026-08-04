require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your Next.js frontend to talk to this backend
app.use(express.json()); // Allows the server to accept JSON data

// Database Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});
// Test Database Connection
pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL Database successfully.'))
  .catch((err) => console.error('❌ PostgreSQL Connection Error:', err));

// Add error handler for idle clients to prevent crashing on ECONNRESET
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

// Import and Use Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/v1/auth', authRoutes);
  
// Basic Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'LMS Backend is running smoothly!' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});