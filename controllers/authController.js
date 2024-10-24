const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register a new user
exports.register = async (req, res) => {
  const { username, name, email, password } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });

    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });
    if (existingUsername) return res.status(400).json({ message: 'Username already taken.' });

    // Create a new user
    const newUser = await User.create({ username, name, email, password });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.userId,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password.' });

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
