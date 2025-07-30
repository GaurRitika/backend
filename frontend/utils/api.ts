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
): Promise<any> => {
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