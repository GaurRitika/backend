const express = require('express');
const router = express.Router();
const omnidimController = require('../controllers/omnidimController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Webhook endpoint for OmniDIM to send voice call data
// This endpoint should NOT require authentication as it's called by OmniDIM
router.post('/webhook', omnidimController.handleOmniDIMWebhook);

// Initiate voice call to resident (Admin only)
router.post('/initiate-call', authenticateToken, requireAdmin, omnidimController.initiateVoiceCall);

// Get voice call statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, omnidimController.getVoiceCallStats);

module.exports = router; 