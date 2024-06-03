const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const jwtSecret = config.get('jwtSecret');
    if (!jwtSecret) {
      return res.status(500).json({ msg: 'JWT secret is not defined in configuration' });
    }

    const decoded = jwt.verify(token.split(' ')[1], jwtSecret);
    req.user = { id: decoded.id }; // Ensure req.user has the expected structure
    console.log('Token is valid:', decoded);
    next();
  } catch (err) {
    console.log('Token is not valid:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
