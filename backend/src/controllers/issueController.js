const Issue = require('../models/Issue');
const User = require('../models/User');

// Create new issue (Resident only)
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const residentId = req.user._id; // Use _id instead of id

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const issue = new Issue({
      title,
      description,
      category,
      priority: priority || 'medium',
      resident: residentId
    });

    await issue.save();
    
    // Populate resident info for response
    await issue.populate('resident', 'name email');

    res.status(201).json({
      message: 'Issue created successfully',
      issue
    });
  } catch (err) {
    console.error('Create issue error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all issues (Admin only)
exports.getAllIssues = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;

    const issues = await Issue.find(query)
      .populate('resident', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments(query);

    res.json({
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('Get all issues error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my issues (Resident only)
exports.getMyIssues = async (req, res) => {
  try {
    const residentId = req.user._id;
    const { status, page = 1, limit = 10 } = req.query;
    
    let query;
    
    // Get issues for current resident
    let residentIds = [residentId];
    
    // If user has phone number, also include voice call users with same phone number
    if (req.user.phone) {
      const voiceCallUsers = await User.find({
        phone: req.user.phone,
        isVoiceCallUser: true,
        role: 'resident'
      }).select('_id');
      
      const voiceCallUserIds = voiceCallUsers.map(user => user._id);
      residentIds = [...residentIds, ...voiceCallUserIds];
    }
    
    // Fetch issues for all matching residents
    query = { resident: { $in: residentIds } };
    if (status) query.status = status;

    const issues = await Issue.find(query)
      .populate('assignedTo', 'name email')
      .populate('resident', 'name email phone isVoiceCallUser')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments(query);

    res.json({
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error('Get my issues error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update issue status (Admin only)
exports.updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status, adminNotes, assignedTo } = req.body;
    const adminId = req.user._id; // Use _id instead of id

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Update fields
    if (status) {
      issue.status = status;
      if (status === 'resolved') {
        issue.resolvedAt = new Date();
      }
    }
    if (adminNotes !== undefined) issue.adminNotes = adminNotes;
    if (assignedTo) issue.assignedTo = assignedTo;

    await issue.save();
    
    // Populate for response
    await issue.populate('resident', 'name email');
    await issue.populate('assignedTo', 'name email');

    res.json({
      message: 'Issue updated successfully',
      issue
    });
  } catch (err) {
    console.error('Update issue error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const { issueId } = req.params;
    const userId = req.user._id; // Use _id instead of id
    const userRole = req.user.role;

    const issue = await Issue.findById(issueId)
      .populate('resident', 'name email')
      .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user has access to this issue
    if (userRole === 'resident' && issue.resident._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ issue });
  } catch (err) {
    console.error('Get issue by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get issue statistics (Admin only)
exports.getIssueStats = async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIssues = await Issue.countDocuments();
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });

    res.json({
      statusStats: stats,
      categoryStats,
      totalIssues,
      pendingIssues,
      resolvedIssues
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 

// Utility function to link voice call issues to existing residents
exports.linkVoiceCallIssues = async (req, res) => {
  try {
    // Find all voice call users
    const voiceCallUsers = await User.find({ isVoiceCallUser: true });
    
    let linkedCount = 0;
    let results = [];
    
    for (const voiceUser of voiceCallUsers) {
      if (!voiceUser.phone || voiceUser.phone === 'unknown') continue;
      
      // Clean the phone number
      const cleanPhone = voiceUser.phone.replace(/\D/g, '');
      
      // Find existing resident with matching phone number
      const existingResident = await User.findOne({
        $and: [
          { isVoiceCallUser: { $ne: true } },
          { role: 'resident' },
          {
            $or: [
              { phone: voiceUser.phone },
              { phone: cleanPhone },
              { phone: `+${cleanPhone}` },
              { phone: { $regex: cleanPhone } }
            ]
          }
        ]
      });
      
      if (existingResident) {
        // Update all issues from this voice call user to point to the existing resident
        const updateResult = await Issue.updateMany(
          { resident: voiceUser._id },
          { resident: existingResident._id }
        );
        
        linkedCount += updateResult.modifiedCount;
        
        results.push({
          voiceUser: {
            id: voiceUser._id,
            name: voiceUser.name,
            phone: voiceUser.phone
          },
          linkedTo: {
            id: existingResident._id,
            name: existingResident.name,
            phone: existingResident.phone
          },
          issuesLinked: updateResult.modifiedCount
        });
        
        console.log(`Linked ${updateResult.modifiedCount} issues from voice user ${voiceUser.name} to resident ${existingResident.name}`);
      }
    }
    
    res.json({
      message: `Successfully linked ${linkedCount} voice call issues to existing residents`,
      linkedCount,
      results
    });
    
  } catch (err) {
    console.error('Link voice call issues error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 