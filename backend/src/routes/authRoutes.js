const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Get admin preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    res.json({ preferences: req.user.preferences || {} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    const { notifications, theme } = req.body;
    if (notifications) {
      req.user.preferences.notifications = {
        ...req.user.preferences.notifications,
        ...notifications
      };
    }
    if (theme) {
      req.user.preferences.theme = theme;
    }
    await req.user.save();
    res.json({ message: 'Preferences updated', preferences: req.user.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 