const Issue = require('../models/Issue');
const User = require('../models/User');
const omnidimService = require('../services/omnidimService');

// Handle webhook from OmniDIM after voice call
exports.handleOmniDIMWebhook = async (req, res) => {
  try {
    // Log the complete request for debugging
    console.log('OmniDIM Webhook received - Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    // Handle case where req.body might be empty or malformed
    if (!req.body || typeof req.body !== 'object') {
      console.log('Invalid or empty request body received');
      return res.status(400).json({
        message: 'Invalid request body. Expected JSON object with issue data.'
      });
    }

    // Extract data from the new OmniDIM webhook structure
    const { 
      call_id,
      bot_id,
      bot_name,
      phone_number,
      call_date,
      user_email,
      call_report 
    } = req.body;

    // Extract variables from call_report structure
    const extractedVariables = call_report?.extracted_variables || {};
    const {
      issue_type,
      location,
      description,
      phone_number: extracted_phone
    } = extractedVariables;

    // Use the summary from call_report if description is not available
    const summary = call_report?.summary || 'No summary available';
    const conversationSummary = call_report?.conversation_summary || summary;

    console.log('OmniDIM Webhook parsed fields:', {
      issue_type,
      location,
      description,
      phone_number: phone_number || extracted_phone,
      call_id
    });

    // Provide default values for missing fields
    const safeIssueType = issue_type || 'general_inquiry';
    const safeLocation = location || 'Not specified';
    const safeDescription = description || summary || 'Voice call issue - details to be updated';
    const safePhoneNumber = phone_number || extracted_phone || 'unknown';

    // Map OmniDIM issue_type to our category system
    const categoryMapping = {
      'water_leakage': 'maintenance',
      'water problem': 'maintenance',
      'water leak': 'maintenance',
      'leakage': 'maintenance',
      'plumbing': 'maintenance',
      'electricity_problem': 'utilities',
      'electrical': 'utilities',
      'power': 'utilities',
      'noise_complaint': 'noise',
      'noise': 'noise',
      'loud': 'noise',
      'security_issue': 'security',
      'security': 'security',
      'theft': 'security',
      'cleaning_request': 'cleaning',
      'cleaning': 'cleaning',
      'dirty': 'cleaning',
      'parking_issue': 'parking',
      'parking': 'parking',
      'car': 'parking',
      'general_inquiry': 'general',
      'general': 'general',
      'question': 'general',
      'help': 'general'
    };

    const category = categoryMapping[safeIssueType] || 'general';

    // Determine priority based on issue type
    const priorityMapping = {
      'water_leakage': 'urgent',
      'water problem': 'urgent',
      'water leak': 'urgent',
      'leakage': 'urgent',
      'plumbing': 'urgent',
      'electricity_problem': 'high',
      'electrical': 'high',
      'power': 'high',
      'security_issue': 'high',
      'security': 'high',
      'theft': 'high',
      'noise_complaint': 'medium',
      'noise': 'medium',
      'loud': 'medium',
      'parking_issue': 'medium',
      'parking': 'medium',
      'car': 'medium',
      'cleaning_request': 'low',
      'cleaning': 'low',
      'dirty': 'low',
      'general_inquiry': 'low',
      'general': 'low',
      'question': 'low',
      'help': 'low'
    };

    const priority = priorityMapping[safeIssueType] || 'medium';

    console.log('Processing issue:', {
      originalIssueType: issue_type,
      safeIssueType: safeIssueType,
      category: category,
      priority: priority
    });

    // Create title from issue type and location - with null safety
    const title = `${safeIssueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} - ${safeLocation}`;

    // Find or create resident based on phone number or email
    let resident = null;
    
    try {
      console.log('Looking for resident with email:', user_email);
      
      // Try to find resident by email first (if provided)
      if (user_email && user_email !== 'unknown') {
        resident = await User.findOne({ email: user_email, role: 'resident' });
        console.log('Found existing resident by email:', resident ? resident._id : 'Not found');
      }
      
      // If not found by email, try by phone number
      if (!resident && safePhoneNumber && safePhoneNumber !== 'unknown' && safePhoneNumber !== 'Not provided') {
        resident = await User.findOne({ phone: safePhoneNumber, role: 'resident' });
        console.log('Found existing resident by phone:', resident ? resident._id : 'Not found');
      }
      
      if (!resident) {
        console.log('Creating new resident for email:', user_email);
        // Create a new resident
        const residentName = user_email ? 
          `Voice Call Resident (${user_email.split('@')[0]})` : 
          `Voice Call Resident (${safePhoneNumber !== 'unknown' ? safePhoneNumber : 'Unknown'})`;
        
        const residentEmail = user_email || `voice_${Date.now()}@community.com`;
        
        resident = new User({
          name: residentName,
          email: residentEmail,
          phone: safePhoneNumber,
          role: 'resident',
          isVoiceCallUser: true,
          password: "tempPassword123" // Add default password for voice users
        });
        await resident.save();
        console.log('Created new voice call resident:', resident._id, 'with email:', residentEmail);
      } else {
        console.log('Using existing resident:', resident._id, 'with email:', resident.email);
      }
    } catch (userError) {
      console.error('Error creating/finding resident:', userError);
      // If user creation fails, create a minimal fallback
      resident = {
        _id: 'temp_' + Date.now(),
        name: 'Voice Call User',
        email: user_email || 'temp@community.com',
        phone: safePhoneNumber
      };
    }

    // Create the issue
    const issue = new Issue({
      title,
      description: safeDescription,
      category,
      priority,
      resident: resident._id,
      source: 'voice_call',
      voiceCallData: {
        callId: call_id || 'unknown',
        botId: bot_id || 'unknown',
        botName: bot_name || 'Community Support Assistant',
        phoneNumber: safePhoneNumber,
        callDate: call_date || new Date().toISOString(),
        userEmail: user_email || 'unknown',
        conversationSummary: conversationSummary,
        extractedVariables: extractedVariables,
        issueType: safeIssueType,
        location: safeLocation,
        fullConversation: call_report?.full_conversation || 'No conversation available',
        sentiment: call_report?.sentiment || 'Neutral',
        interactions: call_report?.interactions || []
      }
    });

    await issue.save();
    console.log('Issue created from voice call:', issue._id);
    
    // Try to populate resident info for response, but don't fail if it doesn't work
    let populatedIssue = issue;
    try {
      if (resident._id && !resident._id.toString().startsWith('temp_')) {
        populatedIssue = await issue.populate('resident', 'name email phone');
      }
    } catch (populateError) {
      console.log('Could not populate resident info:', populateError.message);
    }

    res.status(200).json({
      message: 'Voice call issue created successfully',
      issue: {
        id: issue._id,
        title: issue.title,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        resident: populatedIssue.resident || {
          name: resident.name,
          email: resident.email,
          phone: resident.phone
        }
      },
      debug: {
        receivedFields: {
          issue_type: !!issue_type,
          location: !!location,
          description: !!description,
          phone_number: !!safePhoneNumber,
          user_email: !!user_email,
          call_report: !!call_report
        }
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

