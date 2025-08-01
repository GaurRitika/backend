const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all conversations for the current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name email')
    .populate('lastMessage')
    .sort({ lastMessageAt: -1 });

    // Add unread count for each conversation
    const conversationsWithUnread = conversations.map(conv => {
      const unreadCount = conv.unreadCount.get(req.user.id) || 0;
      return {
        ...conv.toObject(),
        unreadCount
      };
    });

    res.json(conversationsWithUnread);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: { $in: conversation.participants.filter(p => p.toString() !== req.user.id) } },
        { receiver: req.user.id, sender: { $in: conversation.participants.filter(p => p.toString() !== req.user.id) } }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        receiver: req.user.id,
        sender: { $in: conversation.participants.filter(p => p.toString() !== req.user.id) },
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Update unread count
    conversation.unreadCount.set(req.user.id, 0);
    await conversation.save();

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text', attachments = [] } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({ message: 'Content and receiver are required' });
    }

    // Check if receiver exists and is a resident
    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.role !== 'resident') {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Create or find conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, receiverId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user.id, receiverId],
        unreadCount: new Map([[receiverId, 1]])
      });
    } else {
      // Increment unread count for receiver
      const currentUnread = conversation.unreadCount.get(receiverId) || 0;
      conversation.unreadCount.set(receiverId, currentUnread + 1);
    }

    // Create message
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
      messageType,
      attachments
    });

    await message.save();

    // Update conversation
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Populate sender and receiver info
    await message.populate('sender', 'name email');
    await message.populate('receiver', 'name email');

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all residents for community members list
router.get('/residents', auth, async (req, res) => {
  try {
    const residents = await User.find({ 
      role: 'resident', 
      status: 'active',
      _id: { $ne: req.user.id } // Exclude current user
    })
    .select('name email createdAt')
    .sort({ name: 1 });

    res.json(residents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark messages as read
router.put('/mark-read/:senderId', auth, async (req, res) => {
  try {
    const { senderId } = req.params;

    await Message.updateMany(
      {
        sender: senderId,
        receiver: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Update conversation unread count
    const conversation = await Conversation.findOne({
      participants: { $all: [req.user.id, senderId] }
    });

    if (conversation) {
      conversation.unreadCount.set(req.user.id, 0);
      await conversation.save();
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;