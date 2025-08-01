# Community Messaging Features

## Overview
The resident management system now includes a comprehensive real-time messaging system that allows residents to communicate with each other through the community section.

## Features Implemented

### 1. Real-time Messaging with Socket.IO
- **Real-time Communication**: Messages are delivered instantly using Socket.IO
- **Typing Indicators**: Shows when someone is typing a message
- **Message Status**: Tracks read/unread status of messages
- **Conversation Management**: Organizes messages into conversations between users

### 2. Community Members List
- **Real Resident Data**: Shows all registered residents from the database
- **User Profiles**: Displays resident names, emails, and join dates
- **Quick Access**: Click "Message" button to start chatting with any resident

### 3. Chat Interface
- **Modal-based Chat**: Clean, modern chat interface in a modal window
- **Message History**: Loads previous conversation history
- **Real-time Updates**: New messages appear instantly
- **Responsive Design**: Works on desktop and mobile devices

### 4. Backend API Endpoints
- `GET /api/messages/residents` - Get all community members
- `GET /api/messages/conversations` - Get user's conversations
- `GET /api/messages/conversations/:id/messages` - Get conversation messages
- `POST /api/messages/send` - Send a new message
- `PUT /api/messages/mark-read/:senderId` - Mark messages as read

## Technical Implementation

### Backend Components
1. **Message Model** (`backend/src/models/Message.js`)
   - Stores individual messages with sender, receiver, content, and metadata
   - Includes read status and timestamps

2. **Conversation Model** (`backend/src/models/Conversation.js`)
   - Groups messages between two users
   - Tracks last message and unread counts

3. **Message Routes** (`backend/src/routes/messageRoutes.js`)
   - Handles all messaging API endpoints
   - Includes authentication and authorization

4. **Socket.IO Integration** (`backend/src/app.js`)
   - Real-time message delivery
   - Typing indicators
   - User presence tracking

### Frontend Components
1. **ChatModal Component** (`frontend/components/ChatModal.tsx`)
   - Main chat interface
   - Real-time message handling
   - Resident selection

2. **Socket Manager** (`frontend/utils/socket.ts`)
   - Manages Socket.IO connections
   - Handles real-time events
   - Connection state management

3. **Message API** (`frontend/utils/api.ts`)
   - REST API calls for messaging
   - Integration with backend endpoints

## How to Use

### For Residents
1. Navigate to the Community section
2. Click on the "Community Members" tab
3. Click "Message" next to any resident to start chatting
4. Or click "Community Chat" in the Quick Actions section

### Features Available
- **Send Messages**: Type and send text messages
- **Real-time Delivery**: Messages appear instantly
- **Typing Indicators**: See when someone is typing
- **Message History**: View previous conversations
- **Read Status**: Messages are marked as read when viewed

## Setup Instructions

### Backend Setup
1. Install dependencies: `npm install`
2. Create `.env` file based on `.env.example`
3. Start the server: `npm start`

### Frontend Setup
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`

### Database Requirements
- MongoDB instance running
- User collection with resident data
- Message and Conversation collections will be created automatically

## Security Features
- **Authentication Required**: All messaging endpoints require valid JWT tokens
- **User Authorization**: Users can only access their own conversations
- **Input Validation**: Message content is validated and sanitized
- **Rate Limiting**: Built-in protection against spam

## Future Enhancements
- File and image sharing
- Group conversations
- Message search functionality
- Push notifications
- Message encryption
- Voice messages

## Troubleshooting

### Common Issues
1. **Socket Connection Failed**: Check if backend is running and CORS is configured
2. **Messages Not Loading**: Verify authentication token is valid
3. **Real-time Not Working**: Ensure Socket.IO is properly connected

### Debug Mode
Enable debug logging by setting `DEBUG=socket.io:*` in your environment variables.