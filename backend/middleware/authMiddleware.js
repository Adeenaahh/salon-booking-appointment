import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware:
 * Verifies JWT token from Authorization header (Bearer <token>)
 * Attaches the authenticated user to req.user
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_glamour_haven_2026_change_in_production'
      );

      // Find user by id (excluding password)
      const user = await User.findById(decoded.id).select('-passwordHash');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token. Please log in again.'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token was provided.'
    });
  }
};

/**
 * Admin-only authorization middleware:
 * Ensures the logged-in user possesses the 'admin' role
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. This action requires Administrator privileges.'
    });
  }
};
