const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Issue = require('../models/Issue');
const { authenticateToken } = require('../middleware/auth');

// Get comprehensive analytics (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get date range from query params (default to last 30 days)
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Basic statistics
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });
    const rejectedIssues = await Issue.countDocuments({ status: 'rejected' });

    // Calculate average resolution time
    const resolvedIssuesWithTime = await Issue.find({ 
      status: 'resolved',
      updatedAt: { $gte: start, $lte: end }
    }).select('createdAt updatedAt');

    let avgResolutionTime = 0;
    if (resolvedIssuesWithTime.length > 0) {
      const totalTime = resolvedIssuesWithTime.reduce((sum, issue) => {
        return sum + (new Date(issue.updatedAt) - new Date(issue.createdAt));
      }, 0);
      avgResolutionTime = Math.round(totalTime / resolvedIssuesWithTime.length / (1000 * 60 * 60 * 24)); // in days
    }

    // Category breakdown
    const categoryStats = await Issue.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Priority distribution
    const priorityStats = await Issue.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly trends
    const monthlyTrends = await Issue.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top residents by issue count
    const topResidents = await Issue.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $lookup: {
          from: 'users',
          localField: 'resident',
          foreignField: '_id',
          as: 'residentInfo'
        }
      },
      { $unwind: '$residentInfo' },
      {
        $group: {
          _id: '$resident',
          name: { $first: '$residentInfo.name' },
          email: { $first: '$residentInfo.email' },
          issueCount: { $sum: 1 },
          resolvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          }
        }
      },
      { $sort: { issueCount: -1 } },
      { $limit: 10 }
    ]);

    // Status timeline for the period
    const statusTimeline = await Issue.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Response time analysis
    const responseTimeStats = await Issue.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $addFields: {
          responseTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' }
        }
      }
    ]);

    res.json({
      overview: {
        totalIssues,
        resolvedIssues,
        pendingIssues,
        inProgressIssues,
        rejectedIssues,
        avgResolutionTime,
        resolutionRate: totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0
      },
      categoryBreakdown: categoryStats,
      priorityDistribution: priorityStats,
      monthlyTrends,
      topResidents,
      statusTimeline,
      responseTime: responseTimeStats[0] || { avgResponseTime: 0, minResponseTime: 0, maxResponseTime: 0 },
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get real-time dashboard stats
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayIssues = await Issue.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow }
    });

    const todayResolved = await Issue.countDocuments({
      status: 'resolved',
      updatedAt: { $gte: today, $lt: tomorrow }
    });

    // This week's stats
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekIssues = await Issue.countDocuments({
      createdAt: { $gte: weekStart }
    });

    const weekResolved = await Issue.countDocuments({
      status: 'resolved',
      updatedAt: { $gte: weekStart }
    });

    // Recent activity (last 10 issues)
    const recentIssues = await Issue.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('resident', 'name email')
      .select('-__v');

    res.json({
      today: {
        newIssues: todayIssues,
        resolvedIssues: todayResolved
      },
      thisWeek: {
        newIssues: weekIssues,
        resolvedIssues: weekResolved
      },
      recentActivity: recentIssues
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 