const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<unknown> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string, role: 'resident' | 'admin') => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },
};

// Issue API functions
export const issueAPI = {
  // Create new issue (Resident only)
  createIssue: async (issueData: {
    title: string;
    description: string;
    category: string;
    priority?: string;
  }) => {
    return apiRequest('/api/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  // Get all issues (Admin only)
  getAllIssues: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    return apiRequest(`/api/issues${queryString ? `?${queryString}` : ''}`);
  },

  // Get my issues (Resident only)
  getMyIssues: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    return apiRequest(`/api/issues/my-issues${queryString ? `?${queryString}` : ''}`);
  },

  // Update issue status (Admin only)
  updateIssueStatus: async (
    issueId: string,
    updateData: {
      status?: string;
      adminNotes?: string;
      assignedTo?: string;
    }
  ) => {
    return apiRequest(`/api/issues/${issueId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Get issue by ID
  getIssueById: async (issueId: string) => {
    return apiRequest(`/api/issues/${issueId}`);
  },

  // Get issue statistics (Admin only)
  getIssueStats: async () => {
    return apiRequest('/api/issues/stats');
  },
};

// Resident API functions
export const residentAPI = {
  // Get all residents (Admin only)
  getAllResidents: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    return apiRequest(`/api/residents${queryString ? `?${queryString}` : ''}`);
  },

  // Get single resident (Admin only)
  getResidentById: async (residentId: string) => {
    return apiRequest(`/api/residents/${residentId}`);
  },

  // Create new resident (Admin only)
  createResident: async (residentData: {
    name: string;
    email: string;
    password: string;
  }) => {
    return apiRequest('/api/residents', {
      method: 'POST',
      body: JSON.stringify(residentData),
    });
  },

  // Update resident status (Admin only)
  updateResidentStatus: async (residentId: string, status: string) => {
    return apiRequest(`/api/residents/${residentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete resident (Admin only)
  deleteResident: async (residentId: string) => {
    return apiRequest(`/api/residents/${residentId}`, {
      method: 'DELETE',
    });
  },
};

// Analytics API functions
export const analyticsAPI = {
  // Get comprehensive analytics (Admin only)
  getAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const queryString = queryParams.toString();
    return apiRequest(`/api/analytics${queryString ? `?${queryString}` : ''}`);
  },

  // Get dashboard stats (Admin only)
  getDashboardStats: async () => {
    return apiRequest('/api/analytics/dashboard');
  },
};

// Preferences API functions
export const preferencesAPI = {
  // Get preferences (role-based)
  getPreferences: async (role: 'admin' | 'resident'): Promise<{ preferences: { notifications: { email: boolean; sms: boolean; push: boolean }; theme: string } }> => {
    const endpoint = role === 'admin' ? '/api/auth/preferences' : '/api/residents/preferences';
    return apiRequest(endpoint) as Promise<{ preferences: { notifications: { email: boolean; sms: boolean; push: boolean }; theme: string } }>;
  },
  // Update preferences (role-based)
  updatePreferences: async (role: 'admin' | 'resident', preferences: { notifications?: { email?: boolean; sms?: boolean; push?: boolean }; theme?: string }): Promise<{ message: string; preferences: { notifications: { email: boolean; sms: boolean; push: boolean }; theme: string } }> => {
    const endpoint = role === 'admin' ? '/api/auth/preferences' : '/api/residents/preferences';
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    }) as Promise<{ message: string; preferences: { notifications: { email: boolean; sms: boolean; push: boolean }; theme: string } }>;
  },
};

// Notification API functions
export const notificationAPI = {
  // Get notifications for current user
  getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean; type?: string }): Promise<{
    notifications: Array<{
      _id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      read: boolean;
      relatedIssue?: { _id: string; title: string; status: string; category: string };
      actionUrl?: string;
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    unreadCount: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly.toString());
    if (params?.type) queryParams.append('type', params.type);
    
    const endpoint = `/api/notifications?${queryParams.toString()}`;
    return apiRequest(endpoint) as Promise<{
      notifications: Array<{
        _id: string;
        title: string;
        message: string;
        type: string;
        priority: string;
        read: boolean;
        relatedIssue?: { _id: string; title: string; status: string; category: string };
        actionUrl?: string;
        createdAt: string;
      }>;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
      unreadCount: number;
    }>;
  },
  
  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<{
    _id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    read: boolean;
    createdAt: string;
  }> => {
    return apiRequest(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    }) as Promise<{
      _id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      read: boolean;
      createdAt: string;
    }>;
  },
  
  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string; updatedCount: number }> => {
    return apiRequest('/api/notifications/read-all', {
      method: 'PATCH',
    }) as Promise<{ message: string; updatedCount: number }>;
  },
  
  // Delete notification
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    return apiRequest(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    }) as Promise<{ message: string }>;
  },
  
  // Clear all notifications
  clearAllNotifications: async (): Promise<{ message: string; deletedCount: number }> => {
    return apiRequest('/api/notifications', {
      method: 'DELETE',
    }) as Promise<{ message: string; deletedCount: number }>;
  },
  
  // Admin: Send notification to specific user
  sendNotification: async (data: {
    recipientId: string;
    title: string;
    message: string;
    type?: string;
    priority?: string;
    actionUrl?: string;
  }): Promise<{
    _id: string;
    title: string;
    message: string;
    type: string;
    priority: string;
    recipient: string;
    createdAt: string;
  }> => {
    return apiRequest('/api/notifications/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<{
      _id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      recipient: string;
      createdAt: string;
    }>;
  },
  
  // Admin: Broadcast notification to all users
  broadcastNotification: async (data: {
    title: string;
    message: string;
    type?: string;
    priority?: string;
    actionUrl?: string;
    userRole?: string;
  }): Promise<{ message: string; sentCount: number }> => {
    return apiRequest('/api/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<{ message: string; sentCount: number }>;
  },
  
  // Admin: Get notification statistics
  getNotificationStats: async (): Promise<{
    overview: { total: number; unread: number; read: number };
    byType: Array<{ _id: string; count: number }>;
    byPriority: Array<{ _id: string; count: number }>;
    recentActivity: Array<{
      _id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      recipient: { _id: string; name: string; email: string };
      createdAt: string;
    }>;
  }> => {
    return apiRequest('/api/notifications/stats/overview') as Promise<{
      overview: { total: number; unread: number; read: number };
      byType: Array<{ _id: string; count: number }>;
      byPriority: Array<{ _id: string; count: number }>;
      recentActivity: Array<{
        _id: string;
        title: string;
        message: string;
        type: string;
        priority: string;
        recipient: { _id: string; name: string; email: string };
        createdAt: string;
      }>;
    }>;
  },
};

// Event API functions
export const eventAPI = {
  // Get all events
  getEvents: async (params?: { page?: number; limit?: number; category?: string; isActive?: boolean; upcoming?: boolean }): Promise<{
    events: Array<{
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.upcoming) queryParams.append('upcoming', params.upcoming.toString());
    
    const endpoint = `/api/events?${queryParams.toString()}`;
    return apiRequest(endpoint) as Promise<{
      events: Array<{
        _id: string;
        title: string;
        description: string;
        organizer: { _id: string; name: string; email: string };
        startDate: string;
        endDate: string;
        location: string;
        maxAttendees: number;
        attendees: Array<{ _id: string; name: string; email: string }>;
        category: string;
        isPublic: boolean;
        isActive: boolean;
        imageUrl?: string;
        tags: string[];
        createdAt: string;
      }>;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>;
  },

  // Get event by ID
  getEventById: async (eventId: string): Promise<{
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  }> => {
    return apiRequest(`/api/events/${eventId}`) as Promise<{
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    }>;
  },

  // Create event (Admin only)
  createEvent: async (eventData: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees?: number;
    category?: string;
    isPublic?: boolean;
    isActive?: boolean;
    imageUrl?: string;
    tags?: string[];
  }): Promise<{
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  }> => {
    return apiRequest('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }) as Promise<{
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    }>;
  },

  // Update event (Admin only)
  updateEvent: async (eventId: string, eventData: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    maxAttendees?: number;
    category?: string;
    isPublic?: boolean;
    isActive?: boolean;
    imageUrl?: string;
    tags?: string[];
  }): Promise<{
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  }> => {
    return apiRequest(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }) as Promise<{
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    }>;
  },

  // Delete event (Admin only)
  deleteEvent: async (eventId: string): Promise<{ message: string }> => {
    return apiRequest(`/api/events/${eventId}`, {
      method: 'DELETE',
    }) as Promise<{ message: string }>;
  },

  // Join event
  joinEvent: async (eventId: string): Promise<{ message: string; event: {
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  } }> => {
    return apiRequest(`/api/events/${eventId}/join`, {
      method: 'POST',
    }) as Promise<{ message: string; event: {
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    } }>;
  },

  // Leave event
  leaveEvent: async (eventId: string): Promise<{ message: string; event: {
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  } }> => {
    return apiRequest(`/api/events/${eventId}/leave`, {
      method: 'POST',
    }) as Promise<{ message: string; event: {
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    } }>;
  },

  // Get user's events
  getMyEvents: async (): Promise<Array<{
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  }>> => {
    return apiRequest('/api/events/user/my-events') as Promise<Array<{
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    }>>;
  },

  // Get organized events (Admin only)
  getOrganizedEvents: async (): Promise<Array<{
    _id: string;
    title: string;
    description: string;
    organizer: { _id: string; name: string; email: string };
    startDate: string;
    endDate: string;
    location: string;
    maxAttendees: number;
    attendees: Array<{ _id: string; name: string; email: string }>;
    category: string;
    isPublic: boolean;
    isActive: boolean;
    imageUrl?: string;
    tags: string[];
    createdAt: string;
  }>> => {
    return apiRequest('/api/events/user/organized') as Promise<Array<{
      _id: string;
      title: string;
      description: string;
      organizer: { _id: string; name: string; email: string };
      startDate: string;
      endDate: string;
      location: string;
      maxAttendees: number;
      attendees: Array<{ _id: string; name: string; email: string }>;
      category: string;
      isPublic: boolean;
      isActive: boolean;
      imageUrl?: string;
      tags: string[];
      createdAt: string;
    }>>;
  },

  // Get event statistics (Admin only)
  getEventStats: async (): Promise<{
    overview: { total: number; active: number; upcoming: number; totalAttendees: number };
    byCategory: Array<{ _id: string; count: number; attendees: number }>;
    upcomingEvents: Array<{
      _id: string;
      title: string;
      startDate: string;
      organizer: { _id: string; name: string };
      attendees: Array<{ _id: string; name: string }>;
    }>;
    recentEvents: Array<{
      _id: string;
      title: string;
      startDate: string;
      organizer: { _id: string; name: string };
      attendees: Array<{ _id: string; name: string }>;
    }>;
  }> => {
    return apiRequest('/api/events/stats/overview') as Promise<{
      overview: { total: number; active: number; upcoming: number; totalAttendees: number };
      byCategory: Array<{ _id: string; count: number; attendees: number }>;
      upcomingEvents: Array<{
        _id: string;
        title: string;
        startDate: string;
        organizer: { _id: string; name: string };
        attendees: Array<{ _id: string; name: string }>;
      }>;
      recentEvents: Array<{
        _id: string;
        title: string;
        startDate: string;
        organizer: { _id: string; name: string };
        attendees: Array<{ _id: string; name: string }>;
      }>;
    }>;
  },
};

// Announcement API functions
export const announcementAPI = {
  // Get all announcements
  getAnnouncements: async (params?: { page?: number; limit?: number; category?: string; priority?: string; isActive?: boolean; targetAudience?: string }): Promise<{
    announcements: Array<{
      _id: string;
      title: string;
      content: string;
      author: { _id: string; name: string; email: string };
      priority: string;
      category: string;
      targetAudience: string;
      isActive: boolean;
      publishAt: string;
      expiresAt?: string;
      attachments: string[];
      readBy: string[];
      createdAt: string;
    }>;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.targetAudience) queryParams.append('targetAudience', params.targetAudience);
    
    const endpoint = `/api/announcements?${queryParams.toString()}`;
    return apiRequest(endpoint) as Promise<{
      announcements: Array<{
        _id: string;
        title: string;
        content: string;
        author: { _id: string; name: string; email: string };
        priority: string;
        category: string;
        targetAudience: string;
        isActive: boolean;
        publishAt: string;
        expiresAt?: string;
        attachments: string[];
        readBy: string[];
        createdAt: string;
      }>;
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>;
  },

  // Get announcement by ID
  getAnnouncementById: async (announcementId: string): Promise<{
    _id: string;
    title: string;
    content: string;
    author: { _id: string; name: string; email: string };
    priority: string;
    category: string;
    targetAudience: string;
    isActive: boolean;
    publishAt: string;
    expiresAt?: string;
    attachments: string[];
    readBy: string[];
    createdAt: string;
  }> => {
    return apiRequest(`/api/announcements/${announcementId}`) as Promise<{
      _id: string;
      title: string;
      content: string;
      author: { _id: string; name: string; email: string };
      priority: string;
      category: string;
      targetAudience: string;
      isActive: boolean;
      publishAt: string;
      expiresAt?: string;
      attachments: string[];
      readBy: string[];
      createdAt: string;
    }>;
  },

  // Create announcement (Admin only)
  createAnnouncement: async (announcementData: {
    title: string;
    content: string;
    priority?: string;
    category?: string;
    targetAudience?: string;
    isActive?: boolean;
    publishAt?: string;
    expiresAt?: string;
    attachments?: string[];
  }): Promise<{
    _id: string;
    title: string;
    content: string;
    author: { _id: string; name: string; email: string };
    priority: string;
    category: string;
    targetAudience: string;
    isActive: boolean;
    publishAt: string;
    expiresAt?: string;
    attachments: string[];
    readBy: string[];
    createdAt: string;
  }> => {
    return apiRequest('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    }) as Promise<{
      _id: string;
      title: string;
      content: string;
      author: { _id: string; name: string; email: string };
      priority: string;
      category: string;
      targetAudience: string;
      isActive: boolean;
      publishAt: string;
      expiresAt?: string;
      attachments: string[];
      readBy: string[];
      createdAt: string;
    }>;
  },

  // Update announcement (Admin only)
  updateAnnouncement: async (announcementId: string, announcementData: {
    title?: string;
    content?: string;
    priority?: string;
    category?: string;
    targetAudience?: string;
    isActive?: boolean;
    publishAt?: string;
    expiresAt?: string;
    attachments?: string[];
  }): Promise<{
    _id: string;
    title: string;
    content: string;
    author: { _id: string; name: string; email: string };
    priority: string;
    category: string;
    targetAudience: string;
    isActive: boolean;
    publishAt: string;
    expiresAt?: string;
    attachments: string[];
    readBy: string[];
    createdAt: string;
  }> => {
    return apiRequest(`/api/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    }) as Promise<{
      _id: string;
      title: string;
      content: string;
      author: { _id: string; name: string; email: string };
      priority: string;
      category: string;
      targetAudience: string;
      isActive: boolean;
      publishAt: string;
      expiresAt?: string;
      attachments: string[];
      readBy: string[];
      createdAt: string;
    }>;
  },

  // Delete announcement (Admin only)
  deleteAnnouncement: async (announcementId: string): Promise<{ message: string }> => {
    return apiRequest(`/api/announcements/${announcementId}`, {
      method: 'DELETE',
    }) as Promise<{ message: string }>;
  },

  // Mark announcement as read
  markAsRead: async (announcementId: string): Promise<{ message: string }> => {
    return apiRequest(`/api/announcements/${announcementId}/read`, {
      method: 'POST',
    }) as Promise<{ message: string }>;
  },

  // Get unread announcements for user
  getUnreadAnnouncements: async (): Promise<Array<{
    _id: string;
    title: string;
    content: string;
    author: { _id: string; name: string; email: string };
    priority: string;
    category: string;
    targetAudience: string;
    isActive: boolean;
    publishAt: string;
    expiresAt?: string;
    attachments: string[];
    readBy: string[];
    createdAt: string;
  }>> => {
    return apiRequest('/api/announcements/user/unread') as Promise<Array<{
      _id: string;
      title: string;
      content: string;
      author: { _id: string; name: string; email: string };
      priority: string;
      category: string;
      targetAudience: string;
      isActive: boolean;
      publishAt: string;
      expiresAt?: string;
      attachments: string[];
      readBy: string[];
      createdAt: string;
    }>>;
  },

  // Get authored announcements (Admin only)
  getAuthoredAnnouncements: async (): Promise<Array<{
    _id: string;
    title: string;
    content: string;
    author: { _id: string; name: string; email: string };
    priority: string;
    category: string;
    targetAudience: string;
    isActive: boolean;
    publishAt: string;
    expiresAt?: string;
    attachments: string[];
    readBy: string[];
    createdAt: string;
  }>> => {
    return apiRequest('/api/announcements/user/authored') as Promise<Array<{
      _id: string;
      title: string;
      content: string;
      author: { _id: string; name: string; email: string };
      priority: string;
      category: string;
      targetAudience: string;
      isActive: boolean;
      publishAt: string;
      expiresAt?: string;
      attachments: string[];
      readBy: string[];
      createdAt: string;
    }>>;
  },

  // Get announcement statistics (Admin only)
  getAnnouncementStats: async (): Promise<{
    overview: { total: number; active: number; expired: number; totalReads: number };
    byCategory: Array<{ _id: string; count: number; reads: number }>;
    byPriority: Array<{ _id: string; count: number; reads: number }>;
    recentAnnouncements: Array<{
      _id: string;
      title: string;
      author: { _id: string; name: string; email: string };
      createdAt: string;
    }>;
    topReadAnnouncements: Array<{
      _id: string;
      title: string;
      author: { _id: string; name: string; email: string };
      readBy: string[];
      createdAt: string;
    }>;
  }> => {
    return apiRequest('/api/announcements/stats/overview') as Promise<{
      overview: { total: number; active: number; expired: number; totalReads: number };
      byCategory: Array<{ _id: string; count: number; reads: number }>;
      byPriority: Array<{ _id: string; count: number; reads: number }>;
      recentAnnouncements: Array<{
        _id: string;
        title: string;
        author: { _id: string; name: string; email: string };
        createdAt: string;
      }>;
      topReadAnnouncements: Array<{
        _id: string;
        title: string;
        author: { _id: string; name: string; email: string };
        readBy: string[];
        createdAt: string;
      }>;
    }>;
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = getAuthToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },

  // Get user info from token
  getUserFromToken: () => {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  },

  // Logout user
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
}; 

// OmniDIM API functions
export const omnidimAPI = {
  // Initiate voice call
  initiateCall: async (data: {
    phone_number: string;
    resident_id?: string;
    issue_id?: string;
  }): Promise<{
    message: string;
    call_data: any;
  }> => {
    return apiRequest('/api/omnidim/initiate-call', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<{
      message: string;
      call_data: any;
    }>;
  },

  // Get voice call statistics
  getVoiceCallStats: async (): Promise<{
    totalVoiceCalls: number;
    callsByCategory: Record<string, number>;
    callsByStatus: Record<string, number>;
    averageCallDuration: number;
    recentCalls: Array<{
      _id: string;
      title: string;
      category: string;
      status: string;
      createdAt: string;
      voiceCallData: {
        callId: string;
        phoneNumber: string;
        callDuration: number;
      };
    }>;
  }> => {
    return apiRequest('/api/omnidim/stats') as Promise<{
      totalVoiceCalls: number;
      callsByCategory: Record<string, number>;
      callsByStatus: Record<string, number>;
      averageCallDuration: number;
      recentCalls: Array<{
        _id: string;
        title: string;
        category: string;
        status: string;
        createdAt: string;
        voiceCallData: {
          callId: string;
          phoneNumber: string;
          callDuration: number;
        };
      }>;
    }>;
  },
};
