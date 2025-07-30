const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');
const { authenticateToken } = require('../middleware/auth');

// Get all residents (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const residents = await User.find({ role: 'resident' }).select('-password');
    
    // Get issue counts for each resident
    const residentsWithStats = await Promise.all(
      residents.map(async (resident) => {
        const issueCount = await Issue.countDocuments({ resident: resident._id });
        const resolvedCount = await Issue.countDocuments({ 
          resident: resident._id, 
          status: 'resolved' 
        });
        
        return {
          ...resident.toObject(),
          issueCount,
          resolvedCount,
          resolutionRate: issueCount > 0 ? ((resolvedCount / issueCount) * 100).toFixed(1) : 0
        };
      })
    );

    res.json({ residents: residentsWithStats });
  } catch (error) {
    console.error('Error fetching residents:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single resident (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const resident = await User.findById(req.params.id).select('-password');
    if (!resident || resident.role !== 'resident') {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Get resident's issues
    const issues = await Issue.find({ resident: resident._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const issueCount = await Issue.countDocuments({ resident: resident._id });
    const resolvedCount = await Issue.countDocuments({ 
      resident: resident._id, 
      status: 'resolved' 
    });

    res.json({
      resident: {
        ...resident.toObject(),
        issueCount,
        resolvedCount,
        resolutionRate: issueCount > 0 ? ((resolvedCount / issueCount) * 100).toFixed(1) : 0,
        recentIssues: issues
      }
    });
  } catch (error) {
    console.error('Error fetching resident:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new resident (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new resident
    const resident = new User({
      name,
      email,
      password,
      role: 'resident'
    });

    await resident.save();

    // Return resident without password
    const residentResponse = resident.toObject();
    delete residentResponse.password;

    res.status(201).json({ 
      message: 'Resident created successfully',
      resident: residentResponse 
    });
  } catch (error) {
    console.error('Error creating resident:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resident status (admin only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status } = req.body;
    const validStatuses = ['active', 'inactive', 'suspended'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const resident = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!resident || resident.role !== 'resident') {
      return res.status(404).json({ message: 'Resident not found' });
    }

    res.json({ 
      message: 'Resident status updated successfully',
      resident 
    });
  } catch (error) {
    console.error('Error updating resident status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resident (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const resident = await User.findById(req.params.id);
    if (!resident || resident.role !== 'resident') {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Check if resident has any issues
    const issueCount = await Issue.countDocuments({ resident: resident._id });
    if (issueCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete resident with existing issues. Please resolve all issues first.' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error('Error deleting resident:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resident preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied. Resident only.' });
    }
    res.json({ preferences: req.user.preferences || {} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resident preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'resident') {
      return res.status(403).json({ message: 'Access denied. Resident only.' });
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