const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');

// Get all announcements (public, for residents)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, priority, isActive } = req.query;
    const skip = (page - 1) * limit;
    let query = { isActive: true };
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    // Do NOT filter by targetAudience for residents, show all active
    const announcements = await Announcement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('author', 'name email');
    const total = await Announcement.countDocuments(query);
    res.json({
      announcements,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: skip + announcements.length < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
});

// Get announcement by ID
router.get('/:id', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'name email');

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ message: 'Failed to fetch announcement' });
  }
});

// Create new announcement (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      content,
      priority = 'medium',
      category = 'general',
      targetAudience = 'all',
      isActive = true,
      publishAt,
      expiresAt,
      attachments
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const announcement = new Announcement({
      title,
      content,
      author: req.user.id,
      priority,
      category,
      targetAudience,
      isActive,
      publishAt: publishAt ? new Date(publishAt) : new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      attachments: attachments || []
    });

    await announcement.save();

    // Create notifications for residents if announcement is active
    if (announcement.isActive) {
      try {
        await NotificationService.createAnnouncementNotification(announcement);
      } catch (notificationError) {
        console.error('Failed to create announcement notifications:', notificationError);
        // Don't fail the main request if notification fails
      }
    }

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ message: 'Failed to create announcement' });
  }
});

// Update announcement (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'name email');

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ message: 'Failed to update announcement' });
  }
});

// Delete announcement (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ message: 'Failed to delete announcement' });
  }
});

// Mark announcement as read (Authenticated users)
router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (!announcement.readBy.includes(req.user.id)) {
      announcement.readBy.push(req.user.id);
      await announcement.save();
    }

    res.json({ message: 'Announcement marked as read' });
  } catch (error) {
    console.error('Error marking announcement as read:', error);
    res.status(500).json({ message: 'Failed to mark announcement as read' });
  }
});

// Get unread announcements for user
router.get('/user/unread', authenticateToken, async (req, res) => {
  try {
    const unreadAnnouncements = await Announcement.find({
      isActive: true,
      readBy: { $ne: req.user.id },
      $or: [
        { targetAudience: 'all' },
        { targetAudience: req.user.role }
      ]
    })
    .sort({ priority: -1, createdAt: -1 })
    .populate('author', 'name email');

    res.json(unreadAnnouncements);
  } catch (error) {
    console.error('Error fetching unread announcements:', error);
    res.status(500).json({ message: 'Failed to fetch unread announcements' });
  }
});

// Get announcements by author (Admin only, always return all authored)
router.get('/user/authored', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const announcements = await Announcement.find({ author: req.user.id })
      .sort({ createdAt: -1 })
      .populate('author', 'name email');
    res.json({ announcements });
  } catch (error) {
    console.error('Error fetching authored announcements:', error);
    res.status(500).json({ message: 'Failed to fetch authored announcements' });
  }
});

// Get announcement statistics (Admin only)
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await Announcement.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          expired: { $sum: { $cond: [{ $and: [{ $ne: ['$expiresAt', null] }, { $lt: ['$expiresAt', new Date()] }] }, 1, 0] } },
          totalReads: { $sum: { $size: '$readBy' } }
        }
      }
    ]);

    const categoryStats = await Announcement.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          reads: { $sum: { $size: '$readBy' } }
        }
      }
    ]);

    const priorityStats = await Announcement.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          reads: { $sum: { $size: '$readBy' } }
        }
      }
    ]);

    const recentAnnouncements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('author', 'name email');

    const topReadAnnouncements = await Announcement.find()
      .sort({ 'readBy.length': -1 })
      .limit(5)
      .populate('author', 'name email');

    res.json({
      overview: stats[0] || { total: 0, active: 0, expired: 0, totalReads: 0 },
      byCategory: categoryStats,
      byPriority: priorityStats,
      recentAnnouncements,
      topReadAnnouncements
    });
  } catch (error) {
    console.error('Error fetching announcement stats:', error);
    res.status(500).json({ message: 'Failed to fetch announcement statistics' });
  }
});

module.exports = router; 