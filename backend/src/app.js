const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const residentRoutes = require('./routes/residentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const omnidimRoutes = require('./routes/omnidimRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    socket.userId = decoded.id;
    socket.userName = decoded.name;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userName} (${socket.userId})`);
  
  // Join user to their personal room
  socket.join(socket.userId);

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      // Emit to receiver
      socket.to(data.receiverId).emit('receive_message', {
        ...data,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    socket.to(data.receiverId).emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(data.receiverId).emit('user_stop_typing', {
      userId: socket.userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userName} (${socket.userId})`);
  });
});

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/omnidim', omnidimRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server error' });
});

module.exports = { app, server, io };
