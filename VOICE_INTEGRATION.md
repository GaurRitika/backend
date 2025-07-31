# Voice Integration with OmniDIM

This document explains how the voice call integration works in the Community Management System.

## Overview

The system integrates with OmniDIM to allow residents to report issues via voice calls. The flow is:

1. **Resident** clicks "Voice Support" button → Opens OmniDIM widget
2. **Resident** talks about their problem → OmniDIM processes the conversation
3. **OmniDIM** extracts issue details and sends webhook → System creates issue in database
4. **Admin** sees the voice-generated issues in their dashboard with additional voice call details

## Components

### Backend Components

1. **Issue Model** (`backend/src/models/Issue.js`)
   - Added `source` field to distinguish between 'web' and 'voice_call' issues
   - Added `voiceCallData` object to store call details

2. **User Model** (`backend/src/models/User.js`)
   - Added `phone` field for phone number
   - Added `isVoiceCallUser` flag for voice-created users

3. **OmniDIM Service** (`backend/src/services/omnidimService.js`)
   - Handles API communication with OmniDIM
   - Methods for initiating calls and getting call status

4. **OmniDIM Controller** (`backend/src/controllers/omnidimController.js`)
   - `handleOmniDIMWebhook`: Processes webhook from OmniDIM after voice call
   - `initiateVoiceCall`: Admin function to initiate calls (optional)
   - `getVoiceCallStats`: Get statistics about voice calls

5. **OmniDIM Routes** (`backend/src/routes/omnidimRoutes.js`)
   - `/api/omnidim/webhook` (POST) - Webhook endpoint (no auth required)
   - `/api/omnidim/initiate-call` (POST) - Admin only
   - `/api/omnidim/stats` (GET) - Admin only

### Frontend Components

1. **Resident Dashboard** (`frontend/pages/resident/dashboard.tsx`)
   - Added "Voice Support" button that opens OmniDIM widget in new tab
   - Simple one-click access to voice support

2. **Admin Dashboard** (`frontend/pages/admin/dashboard.tsx`)
   - Shows voice call indicator for issues from voice calls
   - Displays voice call details (phone, duration, location, summary)
   - Updated TypeScript interfaces to include voice call data

## Configuration

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# OmniDIM Configuration
OMNIDIM_API_KEY=your-omnidim-api-key
OMNIDIM_API_URL=https://api.omnidim.io
OMNIDIM_AGENT_ID=your-omnidim-agent-id
BASE_URL=http://localhost:5000  # Your backend URL for webhooks
```

### OmniDIM Setup

1. Get your OmniDIM API credentials
2. Configure your OmniDIM agent to send webhooks to: `{BASE_URL}/api/omnidim/webhook`
3. Update the widget URL in resident dashboard if needed (currently: `https://widget.omnidim.io/8339`)

## Data Flow

### Voice Call to Issue Creation

1. **Resident** clicks "Voice Support" → OmniDIM widget opens
2. **Resident** describes issue via voice
3. **OmniDIM** processes conversation and extracts:
   - `issue_type` (water_leakage, electricity_problem, etc.)
   - `location` (where the issue is)
   - `description` (detailed description)
   - `phone_number` (caller's phone)
   - `conversation_summary` (AI-generated summary)
   - Other metadata (call_duration, call_id, etc.)

4. **OmniDIM** sends webhook to `/api/omnidim/webhook` with extracted data

5. **System** processes webhook:
   - Maps `issue_type` to internal categories
   - Determines priority based on issue type
   - Finds or creates resident based on phone number
   - Creates issue with `source: 'voice_call'` and `voiceCallData`

6. **Admin** sees the issue in dashboard with voice call indicators and details

### Issue Type Mapping

```javascript
const categoryMapping = {
  'water_leakage': 'maintenance',
  'electricity_problem': 'utilities',
  'noise_complaint': 'noise',
  'security_issue': 'security',
  'cleaning_request': 'cleaning',
  'parking_issue': 'parking',
  'general_inquiry': 'general'
};

const priorityMapping = {
  'water_leakage': 'urgent',
  'electricity_problem': 'high',
  'security_issue': 'high',
  'noise_complaint': 'medium',
  'cleaning_request': 'low',
  'parking_issue': 'medium',
  'general_inquiry': 'low'
};
```

## Features

### For Residents
- Simple "Voice Support" button on dashboard
- No complex forms - just speak naturally
- Automatic issue creation from voice conversation

### For Admins
- Clear indicators for voice-generated issues
- Voice call details (phone, duration, location)
- Conversation summary from AI
- Same workflow for managing all issues

## Security

- Webhook endpoint is public (required for OmniDIM)
- Admin functions require authentication
- Phone numbers are stored securely
- Voice call users are automatically created as needed

## Troubleshooting

### Webhook Not Working
1. Check `BASE_URL` is accessible from internet
2. Verify webhook URL in OmniDIM configuration
3. Check server logs for webhook errors

### Issues Not Creating
1. Verify required fields in webhook payload
2. Check issue type mapping
3. Ensure database connection is working

### Voice Widget Not Opening
1. Check widget URL is correct
2. Verify OmniDIM widget ID
3. Check browser popup blockers