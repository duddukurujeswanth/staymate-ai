import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/dbHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'staymate_secret_key_123';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  try {
    const userExists = await db.findOne('User', { email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.create('User', {
      name,
      email,
      password: hashedPassword,
      role: role || 'tenant',
      phone: phone || ''
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.findOne('User', { email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      pgId: user.pgId,
      roomId: user.roomId,
      roomNumber: user.roomNumber,
      sharingType: user.sharingType,
      rentAmount: user.rentAmount,
      rentPaid: user.rentPaid,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await db.findById('User', req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password
    delete user.password;
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.findByIdAndUpdate('User', req.user.id, updates);
    delete updatedUser.password;
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.findOne('User', { email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email' });
    }
    // Simulate email send
    res.json({ message: 'Password reset link sent to registered email address (simulation)' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing request' });
  }
};
