import jwt from 'jsonwebtoken';
import db from '../config/dbHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'staymate_secret_key_123';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await db.findById('User', decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found in system' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Role '${req.user?.role}' is unauthorized.` });
    }
    next();
  };
};
