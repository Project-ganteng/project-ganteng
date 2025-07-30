const jwt = require('jsonwebtoken');
const SimpleDB = require('../utils/simpleDB');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
  static async register(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters long'
        });
      }

      // Create new user
      const user = await SimpleDB.createUser({ email, password });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      console.error('Register error:', error);
      if (error.message === 'User already exists') {
        return res.status(400).json({
          message: 'User already exists with this email'
        });
      }
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      // Validate user
      const user = await SimpleDB.validateUser(email, password);
      if (!user) {
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        user,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await SimpleDB.findUserById(req.user.id);

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      res.json({
        user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
