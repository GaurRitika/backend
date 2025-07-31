const Issue = require('../models/Issue');
const User = require('../models/User');
const omnidimService = require('../services/omnidimService');

// Handle webhook from OmniDIM after voice call
exports.handleOmniDIMWebhook = async (req, res) => {
  try {
    const { 
      issue_type, 
      location, 
      description, 
      phone_number,
      call_duration,
      call_id,
      agent_id,
      conversation_summary,
      extracted_variables 
    } = req.body;

    console.log('OmniDIM Webhook received:', {
      issue_type,
      location,
      description,
      phone_number,
      call_id
    });

    // Validate required fields
    if (!issue_type || !location || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields: issue_type, location, description' 
      });
    }

    // Map OmniDIM issue_type to our category system
    const categoryMapping = {
      'water_leakage': 'maintenance',
      'electricity_problem': 'utilities',
      'noise_complaint': 'noise',
      'security_issue': 'security',
      'cleaning_request': 'cleaning',
      'parking_issue': 'parking',
      'general_inquiry': 'general'
    };

    const category = categoryMapping[issue_type] || 'general';

    // Determine priority based on issue type
    const priorityMapping = {
      'water_leakage': 'urgent',
      'electricity_problem': 'high',
      'security_issue': 'high',
      'noise_complaint': 'medium',
      'cleaning_request': 'low',
      'parking_issue': 'medium',
      'general_inquiry': 'low'
    };

    const priority = priorityMapping[issue_type] || 'medium';

    // Create title from issue type and location
    const title = `${issue_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${location}`;

    // Find or create resident based on phone number
    let resident = await User.findOne({ phone: phone_number, role: 'resident' });
    
    if (!resident) {
      // Create a temporary resident if not found
      resident = new User({
        name: `Voice Call Resident (${phone_number})`,
        email: `voice_${phone_number.replace(/\D/g, '')}@community.com`,
        phone: phone_number,
        role: 'resident',
        isVoiceCallUser: true
      });
      await resident.save();
    }

    // Create the issue
    const issue = new Issue({
      title,
      description,
      category,
      priority,
      resident: resident._id,
      source: 'voice_call',
      voiceCallData: {
        callId: call_id,
        agentId: agent_id,
        phoneNumber: phone_number,
        callDuration: call_duration,
        conversationSummary: conversation_summary,
        extractedVariables: extracted_variables,
        issueType: issue_type,
        location: location
      }
    });

    await issue.save();
    
    // Populate resident info for response
    await issue.populate('resident', 'name email phone');

    console.log('Issue created from voice call:', issue._id);

    res.status(200).json({
      message: 'Voice call issue created successfully',
      issue: {
        id: issue._id,
        title: issue.title,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        resident: issue.resident
      }
    });

  } catch (err) {
    console.error('OmniDIM webhook error:', err);
    res.status(500).json({ 
      message: 'Error processing voice call webhook',
      error: err.message 
    });
  }
};

// Initiate voice call to resident
exports.initiateVoiceCall = async (req, res) => {
  try {
    const { phone_number, resident_id, issue_id } = req.body;

    if (!phone_number) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone_number.replace(/\s/g, ''))) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }

    // Use OmniDIM service to initiate the call
    const callData = await omnidimService.initiateCall(phone_number, {
      resident_id: resident_id,
      issue_id: issue_id
    });

    console.log('Voice call initiated via OmniDIM:', callData);

    res.status(200).json({
      message: 'Voice call initiated successfully',
      call_data: callData
    });

  } catch (err) {
    console.error('Initiate voice call error:', err);
    res.status(500).json({ message: 'Error initiating voice call' });
  }
};

// Get voice call statistics
exports.getVoiceCallStats = async (req, res) => {
  try {
    const voiceCallIssues = await Issue.find({ source: 'voice_call' });
    
    const stats = {
      totalVoiceCalls: voiceCallIssues.length,
      callsByCategory: {},
      callsByStatus: {},
      averageCallDuration: 0,
      recentCalls: []
    };

    // Calculate statistics
    voiceCallIssues.forEach(issue => {
      // Category stats
      stats.callsByCategory[issue.category] = (stats.callsByCategory[issue.category] || 0) + 1;
      
      // Status stats
      stats.callsByStatus[issue.status] = (stats.callsByStatus[issue.status] || 0) + 1;
    });

    // Get recent calls
    stats.recentCalls = await Issue.find({ source: 'voice_call' })
      .populate('resident', 'name phone')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title category status createdAt voiceCallData');

    res.json(stats);

  } catch (err) {
    console.error('Get voice call stats error:', err);
    res.status(500).json({ message: 'Error fetching voice call statistics' });
  }
};

