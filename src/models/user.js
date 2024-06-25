// Define the User model schema if needed for reference or validation purposes
const userSchema = {
    appId: String,
    username: String,
    email: String,
    password: String,
    createdAt: Date,
    updatedAt: Date,
    roles: [String],
  };
  
  module.exports = { userSchema };
  