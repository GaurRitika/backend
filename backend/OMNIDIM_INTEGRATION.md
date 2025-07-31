# OmniDIM Integration for SheBulds

This document explains how to set up and configure OmniDIM.io integration for the SheBulds residential community support system.

## Environment Variables Required

Add these to your `.env` file:

```env
# OmniDIM Configuration
OMNIDIM_API_KEY=your_omnidim_api_key_here
OMNIDIM_API_URL=https://api.omnidim.io
OMNIDIM_AGENT_ID=your_omnidim_agent_id_here
BASE_URL=http://localhost:5000

# Optional: Webhook Secret (if OmniDIM provides webhook signing)
OMNIDIM_WEBHOOK_SECRET=your_webhook_secret_here
```

## API Endpoints

### Webhook Endpoint (Called by OmniDIM)
- **URL:** `POST /api/omnidim/webhook`
- **Purpose:** Receives voice call data from OmniDIM after conversation
- **Authentication:** None (called by OmniDIM)

### Initiate Voice Call (Admin Only)
- **URL:** `POST /api/omnidim/initiate-call`
- **Purpose:** Programmatically initiate a voice call to a resident
- **Authentication:** Required (Admin token)
- **Body:**
  ```json
  {
    "phone_number": "+1234567890",
    "resident_id": "optional_resident_id",
    "issue_id": "optional_issue_id"
  }
  ```

### Voice Call Statistics (Admin Only)
- **URL:** `GET /api/omnidim/stats`
- **Purpose:** Get statistics about voice calls
- **Authentication:** Required (Admin token)

## How to Create an AI Agent on OmniDIM.io

### Step 1: Create Agent
1. Log into your OmniDIM.io account
2. Navigate to "AI Agents" section
3. Click "Create New Agent"
4. Give it a name like "SheBulds Community Support"

### Step 2: Configure Agent Purpose
Set the agent's purpose to something like:
```
You are a community support assistant for a residential community. Your job is to help residents report issues and get information about community services. Be friendly, professional, and efficient in collecting information.
```

### Step 3: Configure Context Breakdown/Variables
Set up these variables to extract from conversations:

1. **issue_type** (Required)
   - Options: water_leakage, electricity_problem, noise_complaint, security_issue, cleaning_request, parking_issue, general_inquiry
   - Description: "What type of issue is the resident reporting?"

2. **location** (Required)
   - Description: "Where is the issue located? (e.g., apartment number, common area, specific room)"

3. **description** (Required)
   - Description: "Detailed description of the issue or inquiry"

4. **phone_number** (Auto-extracted)
   - Description: "Resident's phone number"

### Step 4: Configure Post-Call Actions
Set up webhook to send data to your backend:

- **Webhook URL:** `https://your-domain.com/api/omnidim/webhook`
- **Method:** POST
- **Data Format:**
  ```json
  {
    "issue_type": "{{issue_type}}",
    "location": "{{location}}",
    "description": "{{description}}",
    "phone_number": "{{phone_number}}",
    "call_duration": "{{call_duration}}",
    "call_id": "{{call_id}}",
    "agent_id": "{{agent_id}}",
    "conversation_summary": "{{conversation_summary}}",
    "extracted_variables": "{{all_variables}}"
  }
  ```

### Step 5: Configure Knowledge Base (Optional)
Upload relevant documents like:
- Community rules and regulations
- Emergency contact information
- Maintenance schedules
- Common issue resolutions

### Step 6: Test the Agent
1. Use OmniDIM's testing interface
2. Make a test call to verify the agent collects the right information
3. Check that the webhook sends data to your backend correctly

## Workflow Integration

### Complete Flow:
1. **Admin initiates call** → Backend calls OmniDIM API
2. **Resident answers call** → OmniDIM AI agent handles conversation
3. **Agent collects data** → Extracts issue_type, location, description
4. **Webhook triggered** → OmniDIM sends data to your backend
5. **Issue created** → Backend saves to database
6. **Admin notified** → Issue appears on admin dashboard

### Example Conversation Flow:
```
Agent: "Hello! This is the SheBulds community support line. How can I help you today?"

Resident: "Hi, I have a water leak in my bathroom."

Agent: "I'm sorry to hear about that. Let me help you report this issue. What apartment number are you in?"

Resident: "Apartment 3B."

Agent: "Thank you. Can you tell me more about the water leak? Where exactly in the bathroom is it coming from?"

Resident: "It's coming from the ceiling above the shower. There's water dripping down."

Agent: "I understand. This sounds like a maintenance issue. I've recorded your apartment as 3B, the issue as a water leak in the bathroom ceiling above the shower. Is there anything else I should know about this issue?"

Resident: "No, that's all."

Agent: "Perfect. I've submitted your maintenance request. Someone from our team will contact you within 24 hours. Thank you for calling SheBulds community support!"
```

## Security Considerations

1. **Webhook Validation:** Implement signature validation if OmniDIM provides it
2. **Rate Limiting:** Consider implementing rate limiting on webhook endpoint
3. **Data Validation:** Always validate incoming webhook data
4. **Error Handling:** Implement proper error handling for failed webhooks

## Troubleshooting

### Common Issues:
1. **Webhook not receiving data:** Check URL accessibility and firewall settings
2. **Agent not extracting variables:** Review agent configuration and test conversations
3. **API calls failing:** Verify API key and agent ID
4. **Database errors:** Check MongoDB connection and schema compatibility

### Debug Steps:
1. Check server logs for webhook requests
2. Verify environment variables are set correctly
3. Test webhook endpoint manually
4. Review OmniDIM agent logs for conversation issues 