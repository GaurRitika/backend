const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create notification for announcement
  static async createAnnouncementNotification(announcement) {
    try {
      let recipients = [];
      
      // Get recipients based on target audience
      if (announcement.targetAudience === 'all') {
        recipients = await User.find({ role: 'resident' });
      } else if (announcement.targetAudience === 'owners') {
        recipients = await User.find({ role: 'resident', userType: 'owner' });
      } else if (announcement.targetAudience === 'tenants') {
        recipients = await User.find({ role: 'resident', userType: 'tenant' });
      } else {
        recipients = await User.find({ role: 'resident' });
      }

      // Create notifications for all recipients
      const notifications = recipients.map(recipient => ({
        recipient: recipient._id,
        title: `New Announcement: ${announcement.title}`,
        message: announcement.content.length > 150 
          ? `${announcement.content.substring(0, 150)}...` 
          : announcement.content,
        type: 'announcement',
        priority: announcement.priority,
        actionUrl: `/resident/announcements?id=${announcement._id}`
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} announcement notifications`);
      }

      return notifications.length;
    } catch (error) {
      console.error('Error creating announcement notification:', error);
      throw error;
    }
  }

  // Create notification for event
  static async createEventNotification(event) {
    try {
      // Get all residents as potential event attendees
      const recipients = await User.find({ role: 'resident' });

      // Create notifications for all residents
      const notifications = recipients.map(recipient => ({
        recipient: recipient._id,
        title: `New Event: ${event.title}`,
        message: `Join us for ${event.title} on ${new Date(event.startDate).toLocaleDateString()} at ${event.location}`,
        type: 'event',
        priority: 'medium',
        actionUrl: `/resident/events?id=${event._id}`
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} event notifications`);
      }

      return notifications.length;
    } catch (error) {
      console.error('Error creating event notification:', error);
      throw error;
    }
  }

  // Create notification for issue status update
  static async createIssueUpdateNotification(issue, oldStatus, newStatus) {
    try {
      if (!issue.resident) {
        console.log('No resident found for issue, skipping notification');
        return 0;
      }

      const statusMessages = {
        pending: 'Your issue has been received and is pending review',
        'in-progress': 'Your issue is now being worked on by our team',
        resolved: 'Your issue has been resolved! Thank you for your patience',
        rejected: 'Your issue has been reviewed and additional information may be needed'
      };

      const priorityMap = {
        pending: 'medium',
        'in-progress': 'high',
        resolved: 'medium',
        rejected: 'medium'
      };

      const notification = new Notification({
        recipient: issue.resident,
        title: `Issue Update: ${issue.title}`,
        message: statusMessages[newStatus] || `Your issue status has been updated to ${newStatus}`,
        type: 'issue_update',
        priority: priorityMap[newStatus] || 'medium',
        relatedIssue: issue._id,
        actionUrl: `/resident/dashboard?highlight=${issue._id}`
      });

      await notification.save();
      console.log(`Created issue update notification for ${issue.title}`);

      return 1;
    } catch (error) {
      console.error('Error creating issue update notification:', error);
      throw error;
    }
  }

  // Send system notification to all users
  static async createSystemNotification(title, message, priority = 'medium', userRole = null) {
    try {
      let recipients = [];
      
      if (userRole) {
        recipients = await User.find({ role: userRole });
      } else {
        recipients = await User.find({});
      }

      const notifications = recipients.map(recipient => ({
        recipient: recipient._id,
        title,
        message,
        type: 'system',
        priority
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} system notifications`);
      }

      return notifications.length;
    } catch (error) {
      console.error('Error creating system notification:', error);
      throw error;
    }
  }

  // Send notification to specific user
  static async createUserNotification(recipientId, title, message, type = 'system', priority = 'medium', relatedIssue = null, actionUrl = null) {
    try {
      const notification = new Notification({
        recipient: recipientId,
        title,
        message,
        type,
        priority,
        relatedIssue,
        actionUrl
      });

      await notification.save();
      console.log(`Created notification for user ${recipientId}: ${title}`);

      return notification;
    } catch (error) {
      console.error('Error creating user notification:', error);
      throw error;
    }
  }

  // Get unread notification count for user
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        read: false
      });
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Mark old notifications as read when similar new ones are created
  static async markRelatedAsRead(recipientId, type, relatedIssue = null) {
    try {
      const query = {
        recipient: recipientId,
        type,
        read: false
      };

      if (relatedIssue) {
        query.relatedIssue = relatedIssue;
      }

      await Notification.updateMany(query, { read: true });
      console.log(`Marked related notifications as read for user ${recipientId}`);
    } catch (error) {
      console.error('Error marking related notifications as read:', error);
    }
  }
}

module.exports = NotificationService;