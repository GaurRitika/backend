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
    
    const callReport = req.body.call_report || {};
    const extractedVars = callReport.extracted_variables || {};
    
    // Get values from extracted_variables first, then fallback to root level
    const issue_type = extractedVars.issue_type || req.body.issue_type;
    const location = extractedVars.location || req.body.location;
    const description = extractedVars.description || req.body.description;
    const phone_number = extractedVars.phone_number || req.body.phone_number;
    const call_duration = req.body.call_duration;
    const call_id = req.body.call_id;
    const agent_id = req.body.agent_id;
    const conversation_summary = callReport.summary || req.body.conversation_summary;
    const extracted_variables = extractedVars;

    console.log('OmniDIM Webhook parsed fields:', {
      issue_type,
      location,
      description,
      phone_number,
      call_id,
      conversation_summary
    });

    // Provide default values for missing fields
    const safeIssueType = issue_type || 'general_inquiry';
    const safeLocation = location || 'Not specified';
    const safeDescription = description || 'Voice call issue - details to be updated';
    const safePhoneNumber = phone_number || 'unknown';

    // Map OmniDIM issue_type to our category system
    const categoryMapping = {
      'water_leakage': 'water',
      'water_issue': 'water',
      'power cut': 'electricity',
      'power_cut': 'electricity',
      'electricity_problem': 'electricity',
      'electrical_issue': 'electrical',
      'plumbing_issue': 'plumbing',
      'noise_complaint': 'noise',
      'security_issue': 'security',
      'cleaning_request': 'cleaning',
      'parking_issue': 'parking',
      'maintenance_request': 'maintenance',
      'appliance_issue': 'appliance',
      'heating_issue': 'heating',
      'cooling_issue': 'cooling',
      'pest_control': 'pest_control',
      'general_inquiry': 'general'
    };

    const category = categoryMapping[safeIssueType] || 'general';

    // Determine priority based on issue type
    const priorityMapping = {
      'water_leakage': 'high',
      'water_issue': 'high',
      'power cut': 'high',
      'power_cut': 'high',
      'electricity_problem': 'high',
      'electrical_issue': 'high',
      'plumbing_issue': 'high',
      'security_issue': 'high',
      'noise_complaint': 'medium',
      'cleaning_request': 'low',
      'parking_issue': 'medium',
      'maintenance_request': 'medium',
      'appliance_issue': 'medium',
      'heating_issue': 'medium',
      'cooling_issue': 'medium',
      'pest_control': 'low',
      'general_inquiry': 'low'
    };

    const priority = priorityMapping[safeIssueType] || 'medium';

    // Create title from issue type and location - with null safety
    const issueTypeFormatted = safeIssueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const title = `${issueTypeFormatted} - ${safeLocation}`;

    // Find or create resident based on phone number
    let resident = null;
    
    try {
      // Only try to find/create resident if we have a valid phone number
      if (safePhoneNumber && safePhoneNumber !== 'unknown') {
        // Clean the phone number for better matching
        const cleanPhoneNumber = safePhoneNumber.replace(/\D/g, '');
        
        // First, try to find an existing non-voice-call resident with matching phone
        resident = await User.findOne({
          $and: [
            { role: 'resident' },
            { isVoiceCallUser: { $ne: true } },
            {
              $or: [
                { phone: safePhoneNumber },
                { phone: cleanPhoneNumber },
                { phone: `+${cleanPhoneNumber}` },
                { phone: { $regex: cleanPhoneNumber } }
              ]
            }
          ]
        });
        
        if (resident) {
          console.log('Found existing resident for voice call:', resident._id, resident.name);
        } else {
          // If no existing resident found, try to find existing voice call user
          resident = await User.findOne({ phone: safePhoneNumber, isVoiceCallUser: true });
          
          if (!resident) {
            // Create a temporary resident if not found
            resident = new User({
              name: `Voice Call Resident (${safePhoneNumber})`,
              email: `voice_${cleanPhoneNumber || Date.now()}@community.com`,
              phone: safePhoneNumber,
              role: 'resident',
              isVoiceCallUser: true,
              password: "tempPassword123" // Add default password for voice users
            });
            await resident.save();
            console.log('Created new voice call resident:', resident._id);
          }
        }
      } else {
        // Create a generic resident for unknown phone numbers
        resident = new User({
          name: `Voice Call Resident (Unknown)`,
          email: `voice_unknown_${Date.now()}@community.com`,
          phone: 'unknown',
          role: 'resident',
          isVoiceCallUser: true,
          password: "tempPassword123"
        });
        await resident.save();
        console.log('Created generic voice call resident:', resident._id);
      }
    } catch (userError) {
      console.error('Error creating/finding resident:', userError);
      // If user creation fails, create a minimal fallback
      resident = {
        _id: 'temp_' + Date.now(),
        name: 'Voice Call User',
        email: 'temp@community.com',
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
        agentId: agent_id || 'unknown',
        phoneNumber: safePhoneNumber,
        callDuration: call_duration || 0,
        conversationSummary: conversation_summary || 'No summary available',
        extractedVariables: extracted_variables || {},
        issueType: safeIssueType,
        location: safeLocation
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
          issue_type: issue_type || 'Not provided',
          location: location || 'Not provided',
          description: description || 'Not provided',
          phone_number: phone_number || 'Not provided'
        },
        parsedData: {
          safeIssueType,
          safeLocation,
          safeDescription,
          safePhoneNumber,
          category,
          priority
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
