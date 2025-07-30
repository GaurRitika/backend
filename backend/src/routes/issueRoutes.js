const express = require('express');
const { 
  createIssue, 
  getAllIssues, 
  getMyIssues, 
  updateIssueStatus, 
  getIssueById,
  getIssueStats 
} = require('../controllers/issueController');
const { authenticateToken, requireAdmin, requireResident } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Resident routes
router.post('/', requireResident, createIssue); // Create new issue
router.get('/my-issues', requireResident, getMyIssues); // Get resident's own issues

// Admin routes
router.get('/', requireAdmin, getAllIssues); // Get all issues
router.get('/stats', requireAdmin, getIssueStats); // Get issue statistics
router.put('/:issueId', requireAdmin, updateIssueStatus); // Update issue status

// Common routes
router.get('/:issueId', getIssueById); // Get specific issue (with access control)

module.exports = router; 