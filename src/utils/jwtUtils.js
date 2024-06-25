const jwt = require('jsonwebtoken');

const generateToken = (appId, username) => {
  return jwt.sign({ appId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };
