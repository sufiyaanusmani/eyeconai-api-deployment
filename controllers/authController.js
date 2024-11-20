const User = require('../models/User');
const { generateToken, isValidPassword } = require('../utils/authUtils');
const { Role, Organization } = require('../models');

// Register a new user
exports.register = async (req, res) => {
  const { username, name, email, password, roleId, organizationId } = req.body;

  try {
    // Check if email or username already exists
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });

    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });
    if (existingUsername) return res.status(400).json({ message: 'Username already taken.' });

    // Verify if the provided role and organization exist
    const role = await Role.findByPk(roleId);
    const organization = await Organization.findByPk(organizationId);

    if (!role) return res.status(400).json({ message: 'Invalid role specified.' });
    if (!organization) return res.status(400).json({ message: 'Invalid organization specified.' });

    // Create a new user
    const newUser = await User.create({
      username,
      name,
      email,
      password, // Ensure password is hashed in User model
      roleId: role.roleId,
      organizationId: organization.orgId,
    });

    // Generate token
    const token = generateToken({ userId: newUser.userId, role: role.name, organizationId: organization.orgId });

    res.status(201).json({
      message: 'User registered successfully!',
      user: {
        id: newUser.userId,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: role.name,
        organization: organization.name,
      },
      token, // Return the JWT token
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username }, include: [Role, Organization] });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isPasswordValid = await isValidPassword(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password.' });

    // Generate token including user role and organization info
    const token = generateToken({
      userId: user.userId,
      role: user.Role.name,
      organizationId: user.organizationId, // This should be directly accessed from user
    });

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.userId,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.Role.name,
        organization: user.Organization ? {id: user.Organization.orgId, name: user.Organization.name} : null,
      },
      token, // Return the JWT token
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
