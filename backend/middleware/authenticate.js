const jwt = require('jsonwebtoken');
const SimpleDB = require('../utils/simpleDB');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await SimpleDB.findUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Invalid token.',
      error: error.message
    });
  }
};

module.exports = authenticate;
