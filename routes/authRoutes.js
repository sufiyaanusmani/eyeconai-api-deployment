const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);  // Public route for user registration
router.post('/login', login);        // Public route for user login

module.exports = router;
