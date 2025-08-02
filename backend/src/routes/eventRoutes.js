const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, isActive, upcoming } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNextPage: skip + events.length < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
});

// Create new event (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      maxAttendees,
      category,
      isPublic,
      isActive,
      imageUrl,
      tags
    } = req.body;

    if (!title || !description || !startDate || !endDate || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const event = new Event({
      title,
      description,
      organizer: req.user.id,
      startDate,
      endDate,
      location,
      maxAttendees: maxAttendees || 0,
      category: category || 'general',
      isPublic: isPublic !== false,
      isActive: isActive !== false,
      imageUrl,
      tags: tags || []
    });

    await event.save();

    // Create notifications for residents if event is public and active
    if (event.isPublic && event.isActive) {
      try {
        await NotificationService.createEventNotification(event);
      } catch (notificationError) {
        console.error('Failed to create event notifications:', notificationError);
        // Don't fail the main request if notification fails
      }
    }

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Update event (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('organizer', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete event (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// Join event (Authenticated users)
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isActive) {
      return res.status(400).json({ message: 'Event is not active' });
    }

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    if (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({ message: 'Successfully joined event', event });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: 'Failed to join event' });
  }
});

// Leave event (Authenticated users)
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    event.attendees = event.attendees.filter(id => id.toString() !== req.user.id);
    await event.save();

    res.json({ message: 'Successfully left event', event });
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ message: 'Failed to leave event' });
  }
});

// Get user's events (Authenticated users)
router.get('/user/my-events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({
      'attendees.user': req.user.id
    })
    .sort({ startDate: 1 })
    .populate('organizer', 'name email');

    res.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Failed to fetch user events' });
  }
});

// Get events organized by user (Admin only)
router.get('/user/organized', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const events = await Event.find({
      organizer: req.user.id
    })
    .sort({ startDate: 1 })
    .populate('attendees', 'name email');

    res.json(events);
  } catch (error) {
    console.error('Error fetching organized events:', error);
    res.status(500).json({ message: 'Failed to fetch organized events' });
  }
});

// Get event statistics (Admin only)
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stats = await Event.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          upcoming: { $sum: { $cond: [{ $gte: ['$startDate', new Date()] }, 1, 0] } },
          totalAttendees: { $sum: { $size: '$attendees' } }
        }
      }
    ]);

    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          attendees: { $sum: { $size: '$attendees' } }
        }
      }
    ]);

    const upcomingEvents = await Event.find({
      startDate: { $gte: new Date() },
      isActive: true
    })
    .sort({ startDate: 1 })
    .limit(5)
    .populate('organizer', 'name')
    .populate('attendees', 'name');

    const recentEvents = await Event.find()
      .sort({ startDate: -1 })
      .limit(5)
      .populate('organizer', 'name')
      .populate('attendees', 'name');

    res.json({
      overview: stats[0] || { total: 0, active: 0, upcoming: 0, totalAttendees: 0 },
      byCategory: categoryStats,
      upcomingEvents,
      recentEvents
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({ message: 'Failed to fetch event statistics' });
  }
});

module.exports = router; 