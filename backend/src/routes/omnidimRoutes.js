const express = require('express');
const router = express.Router();
const omnidimController = require('../controllers/omnidimController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Webhook endpoint for OmniDIM to send voice call data
// This endpoint should NOT require authentication as it's called by OmniDIM
router.post('/webhook', omnidimController.handleOmniDIMWebhook);

// Handle GET requests to webhook (for verification)
router.get('/webhook', (req, res) => {
  res.json({ 
    message: 'OmniDIM webhook endpoint is active',
    method: 'Use POST to send webhook data',
    timestamp: new Date().toISOString()
  });
});

// Add this new route for debugging
router.post('/webhook-debug', (req, res) => {
  console.log('=== OMNIDIM DEBUG WEBHOOK ===');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('All keys:', Object.keys(req.body));
  
  // Check for different structures
  if (req.body.call_report) {
    console.log('✅ call_report found');
    console.log('call_report keys:', Object.keys(req.body.call_report));
    
    if (req.body.call_report.extracted_variables) {
      console.log('✅ extracted_variables found');
      console.log('extracted_variables:', JSON.stringify(req.body.call_report.extracted_variables, null, 2));
    }
  }
  
  if (req.body.extracted_variables) {
    console.log('✅ root extracted_variables found');
    console.log('root extracted_variables:', JSON.stringify(req.body.extracted_variables, null, 2));
  }
  
  console.log('================================');
  
  res.json({ message: 'Debug webhook received', data: req.body });
});

// Test endpoint to verify webhook is working
router.post('/webhook-test', (req, res) => {
  console.log('Webhook test received:', JSON.stringify(req.body, null, 2));
  res.json({ 
    message: 'Webhook test successful', 
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Initiate voice call to resident (Admin only)
router.post('/initiate-call', authenticateToken, requireAdmin, omnidimController.initiateVoiceCall);

// Get voice call statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, omnidimController.getVoiceCallStats);

module.exports = router; 
