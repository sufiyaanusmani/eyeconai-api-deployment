const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

exports.isValidPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

exports.generateToken = ({ userId, role, organizationId }) => {
  const payload = { userId, role, organizationId }; // Create a payload with user info

  // Sign the token with the payload and secret, without expiration
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token; // Return the generated token
};