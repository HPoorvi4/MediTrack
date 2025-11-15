const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { validationResult } = require("express-validator");

// -----------------------------------------------------
// Generate JWT token
// -----------------------------------------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// -----------------------------------------------------
// Helper: send unified errors
// -----------------------------------------------------
const sendError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

// -----------------------------------------------------
// @route   POST /api/auth/register
// @desc    Register new user
// -----------------------------------------------------
const register = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, errors.array()[0].msg);
  }

  const { email, password, role, ...profile } = req.body;

  try {
    // Check duplicate email
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existing.rows.length > 0) {
      return sendError(res, 400, "User already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Begin DB transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, role, created_at`,
        [email, passwordHash, role || "patient"]
      );

      const user = userResult.rows[0];

      // Insert patient profile if role = patient
      if (user.role === "patient") {
        const {
          full_name,
          date_of_birth,
          gender,
          blood_group,
          contact_number,
          address,
          city,
          state,
          pin_code,
        } = profile;

        await client.query(
          `INSERT INTO patients
           (user_id, full_name, date_of_birth, gender, blood_group, contact_number, email, address, city, state, pin_code)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            user.id,
            full_name,
            date_of_birth,
            gender,
            blood_group,
            contact_number,
            email,
            address,
            city,
            state,
            pin_code,
          ]
        );
      }

      await client.query("COMMIT");

      return res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user.id),
      });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Register error:", err);
    return sendError(res, 500, "Server error during registration");
  }
};

// -----------------------------------------------------
// @route   POST /api/auth/login
// @desc    Login user
// -----------------------------------------------------
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return sendError(res, 401, "Invalid credentials");
    }

    const user = result.rows[0];

    // Account active?
    if (!user.is_active) {
      return sendError(res, 401, "Account is inactive");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 401, "Invalid credentials");
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, 500, "Server error during login");
  }
};

// -----------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get current user
// -----------------------------------------------------
const getMe = async (req, res) => {
  try {
    // Fetch base user info
    const userResult = await pool.query(
      `SELECT id, email, role, is_active, created_at
       FROM users
       WHERE id = $1 LIMIT 1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return sendError(res, 404, "User not found");
    }

    const user = userResult.rows[0];

    // Fetch additional patient profile if required
    if (user.role === "patient") {
      const profileResult = await pool.query(
        "SELECT * FROM patients WHERE user_id = $1 LIMIT 1",
        [user.id]
      );

      return res.json({
        success: true,
        user,
        profile: profileResult.rows[0] || null,
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("GetMe error:", err);
    return sendError(res, 500, "Server error");
  }
};

module.exports = {
  register,
  login,
  getMe,
};
