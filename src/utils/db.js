const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;

const connectToDatabase = async () => {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
  }
  return client.db('authDb').collection('users');
};

module.exports = { connectToDatabase };
