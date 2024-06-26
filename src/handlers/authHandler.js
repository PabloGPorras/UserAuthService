const { connectToDatabase } = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  console.log("MONGODB_URI:", process.env.MONGODB_URI); // Log the MongoDB URI
  const { action, appId, username, password } = JSON.parse(event.body);
  const users = await connectToDatabase();

  if (action === 'signup') {
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({ appId, username, password: hashedPassword, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return { statusCode: 201, body: JSON.stringify({ message: 'User created' }) };
  }

  if (action === 'login') {
    const user = await users.findOne({ appId, username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ appId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { statusCode: 200, body: JSON.stringify({ token }) };
    }
    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid credentials' }) };
  }

  return { statusCode: 400, body: JSON.stringify({ message: 'Invalid action' }) };
};
