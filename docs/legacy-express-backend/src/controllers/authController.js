const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const register = async (req, res) => {
  try {
    // 1. Extract data from the frontend request
    const { full_name, email, password, role } = req.body;

    // 2. Check if the user already exists
    const userCheck = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3. Encrypt (Hash) the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 4. Insert the new user into the database
    const newUser = await pool.query(
      'INSERT INTO Users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, email, role',
      [full_name, email, password_hash, role]
    );

    // 5. Generate the JWT (JSON Web Token)
    const token = jwt.sign(
      { user_id: newUser.rows[0].user_id, role: newUser.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // 6. Send the success response back to the frontend
    res.status(201).json({
      message: 'User registered successfully!',
      token: token,
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    // 1. Extract login data
    const { email, password } = req.body;

    // 2. Check if the user exists in the database
    const userResult = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // 3. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Generate the JWT "VIP Badge"
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // Badge expires in 24 hours
    );

    // 5. Send success response with the token
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Export BOTH functions now
module.exports = { register, login };