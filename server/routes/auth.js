const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../model/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Генерация JWT
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };

  const options = {
    expiresIn: '1h' // Токен будет действителен в течение 1 часа
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

// Генерация Refresh Token
function generateRefreshToken(user) {
  const payload = {
    id: user.id
  };

  const options = {
    expiresIn: '7d' // Refresh Token будет действителен в течение 7 дней
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

// Маршрут для логина
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.json({ token, refreshToken });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
