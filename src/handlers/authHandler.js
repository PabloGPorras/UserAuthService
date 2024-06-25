const { connectToDatabase } = require('../utils/db');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const { action, appId, username, password } = JSON.parse(event.body);
  const users = await connectToDatabase();

  if (action === 'signup') {
    const existingUser = await users.findOne({ appId, username });
    if (existingUser) {
      return { statusCode: 409, body: JSON.stringify({ message: 'User already exists' }) };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ appId, username, password: hashedPassword, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return { statusCode: 201, body: JSON.stringify({ message: 'User created' }) };
  }

  if (action === 'login') {
    const user = await users.findOne({ appId, username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = generateToken(appId, username);
      return { statusCode: 200, body: JSON.stringify({ token }) };
    }
    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
  }

  return { statusCode: 400, body: JSON.stringify({ message: 'Invalid action' }) };
};
